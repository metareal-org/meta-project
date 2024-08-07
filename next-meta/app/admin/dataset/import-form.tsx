// app/admin/dataset/import-form.tsx

import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminLandVersionStore } from '@/store/admin-store/useAdminLandVersionStore';

interface ImportFormProps {
  onImportSuccess: () => void;
}

const ImportForm: React.FC<ImportFormProps> = ({ onImportSuccess }) => {
  const { 
    file, 
    fileName, 
    versionName, 
    type,
    adminHandleFileChange, 
    adminHandleImport, 
    adminSetFileName, 
    adminSetVersionName,
    adminSetType
  } = useAdminLandVersionStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      adminHandleFileChange(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    await adminHandleImport();
    onImportSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import GeoJSON</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input type="file" onChange={handleFileChange} accept=".json,.geojson" />
          </div>
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="File Name" 
              value={fileName} 
              onChange={(e) => adminSetFileName(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="Version Name" 
              value={versionName} 
              onChange={(e) => adminSetVersionName(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <Select value={type} onValueChange={adminSetType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="mine">Mine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleImport}>Import</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportForm;