import { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { read, utils, write } from 'xlsx';
import { supabase } from '../lib/supabase';

interface ExcelUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ExcelRow {
  [key: string]: string | number | undefined;
}

export default function ExcelUpload({ isOpen, onClose, onSuccess }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadStats, setUploadStats] = useState({ total: 0, success: 0, failed: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
        setError('Please select a valid Excel file (.xlsx, .xls, or .csv)');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      setFile(droppedFile);
      setError(null);
      setSuccess(false);
    } else {
      setError('Please drop a valid Excel file (.xlsx, .xls, or .csv)');
    }
  };

  const parseExcelFile = async (file: File): Promise<ExcelRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet) as ExcelRow[];
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const mapExcelRowToCampaign = (row: ExcelRow) => {
    return {
      name: String(row['Campaign Name'] || row['name'] || ''),
      platform: String(row['Platform'] || row['platform'] || 'Google'),
      status: String(row['Status'] || row['status'] || 'active').toLowerCase(),
      budget: Number(row['Budget'] || row['budget'] || 0),
      spent: Number(row['Spent'] || row['spent'] || 0),
      city: String(row['City'] || row['city'] || ''),
      region: String(row['Region'] || row['region'] || ''),
      bx_type: String(row['BX Type'] || row['bx_type'] || ''),
      traffic_source: String(row['Traffic Source'] || row['traffic_source'] || ''),
      channel: String(row['Channel'] || row['channel'] || ''),
      conversion_type: String(row['Conversion Type'] || row['conversion_type'] || ''),
      center_name: String(row['Center Name'] || row['center_name'] || ''),
      rh: String(row['RH'] || row['rh'] || ''),
    };
  };

  const mapExcelRowToMetrics = (row: ExcelRow, campaignId: string) => {
    return {
      campaign_id: campaignId,
      date: row['Date'] || row['date'] || new Date().toISOString().split('T')[0],
      impressions: Number(row['Impressions'] || row['impressions'] || 0),
      clicks: Number(row['Clicks'] || row['clicks'] || 0),
      conversions: Number(row['Conversions'] || row['conversions'] || 0),
      revenue: Number(row['Revenue'] || row['revenue'] || 0),
      cost: Number(row['Cost'] || row['cost'] || row['Spent'] || row['spent'] || 0),
    };
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await parseExcelFile(file);

      if (data.length === 0) {
        throw new Error('The Excel file is empty or has no data');
      }

      let successCount = 0;
      let failedCount = 0;

      for (const row of data) {
        try {
          const campaignData = mapExcelRowToCampaign(row);

          if (!campaignData.name) {
            failedCount++;
            continue;
          }

          const { data: existingCampaign } = await supabase
            .from('campaigns')
            .select('id')
            .eq('name', campaignData.name)
            .maybeSingle();

          let campaignId: string;

          if (existingCampaign) {
            campaignId = existingCampaign.id;
            await supabase
              .from('campaigns')
              .update(campaignData)
              .eq('id', campaignId);
          } else {
            const { data: newCampaign, error: insertError } = await supabase
              .from('campaigns')
              .insert([campaignData])
              .select()
              .single();

            if (insertError || !newCampaign) {
              failedCount++;
              continue;
            }
            campaignId = newCampaign.id;
          }

          if (row['Impressions'] || row['impressions'] || row['Clicks'] || row['clicks']) {
            const metricsData = mapExcelRowToMetrics(row, campaignId);
            await supabase
              .from('campaign_metrics')
              .insert([metricsData]);
          }

          successCount++;
        } catch (err) {
          console.error('Error processing row:', err);
          failedCount++;
        }
      }

      setUploadStats({ total: data.length, success: successCount, failed: failedCount });
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file. Please check the format.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploadStats({ total: 0, success: 0, failed: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Campaign Name': 'Example Campaign',
        'Platform': 'Google',
        'Status': 'active',
        'Budget': 10000,
        'Spent': 5000,
        'City': 'Mumbai',
        'Region': 'West',
        'BX Type': 'IVF',
        'Traffic Source': 'Paid',
        'Channel': 'Search',
        'Conversion Type': 'Lead',
        'Center Name': 'Mumbai Center',
        'RH': 'Regional Head Name',
        'Date': '2024-01-01',
        'Impressions': 10000,
        'Clicks': 500,
        'Conversions': 25,
        'Revenue': 50000,
        'Cost': 5000,
      },
    ];

    const ws = utils.json_to_sheet(template);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Campaign Template');
    write(wb, { bookType: 'xlsx', type: 'buffer' });

    const blob = new Blob([write(wb, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_upload_template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Upload Campaign Data</h2>
              <p className="text-sm text-gray-600">Import campaigns from Excel file</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              file ? 'border-primary bg-primary-light' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {!file ? (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Drag and drop your Excel file here
                </p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: .xlsx, .xls, .csv
                </p>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Upload Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Upload Successful!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your campaigns have been imported successfully
                  </p>
                </div>
              </div>
              <div className="ml-8 space-y-1 text-sm">
                <p className="text-gray-700">Total rows: {uploadStats.total}</p>
                <p className="text-green-600">Successfully imported: {uploadStats.success}</p>
                {uploadStats.failed > 0 && (
                  <p className="text-red-600">Failed: {uploadStats.failed}</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Important Notes:</p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Campaign Name is required for each row</li>
              <li>Existing campaigns will be updated based on Campaign Name</li>
              <li>New campaigns will be created if they don't exist</li>
              <li>Download the template to see the correct format</li>
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading || success}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
