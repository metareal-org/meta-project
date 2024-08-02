import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosInstance from '@/lib/axios-instance';
import { useToast } from "@/components/ui/use-toast"

interface ImportFormProps {
  onImportSuccess: () => void;
}

const ImportForm: React.FC<ImportFormProps> = ({ onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [versionName, setVersionName] = useState('');
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Set file name based on the uploaded file
      const nameWithoutExtension = selectedFile.name.split('.').slice(0, -1).join('.');
      setFileName(nameWithoutExtension);
    }
  };

  const handleImport = async () => {
    if (!file || !fileName || !versionName) {
      toast({
        title: "Error",
        description: "Please select a file, enter a file name, and provide a version name",
        variant: "destructive",
      })
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', fileName);
    formData.append('version_name', versionName);

    try {
      await axiosInstance.post('/admin/lands/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Success",
        description: "Import successful",
      })
      onImportSuccess();
      
      // Clear the form after successful import
      setFile(null);
      setFileName('');
      setVersionName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Import failed",
        variant: "destructive",
      })
    }
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
              onChange={(e) => setFileName(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="Version Name" 
              value={versionName} 
              onChange={(e) => setVersionName(e.target.value)} 
            />
          </div>
          <Button onClick={handleImport}>Import</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportForm;