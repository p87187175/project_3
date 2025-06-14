import React, { useState } from 'react';
import { AlertCircle, Camera, Send } from 'lucide-react';
import { ComplaintUrgency } from '../types';

interface ComplaintFormProps {
  machine_id: string;
  machine_name: string;
  onSubmit: (data: {
    description: string;
    urgency: ComplaintUrgency;
    image_url?: string;
  }) => void;
  onCancel: () => void;
}

export default function ComplaintForm({ machine_id, machine_name, onSubmit, onCancel }: ComplaintFormProps) {
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<ComplaintUrgency>('medium');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    
    // Simulate image upload (in real app, would upload to cloud storage)
    let image_url = '';
    if (imageFile) {
      image_url = URL.createObjectURL(imageFile);
    }

    onSubmit({
      description: description.trim(),
      urgency,
      image_url: image_url || undefined,
    });

    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const getUrgencyColor = (level: ComplaintUrgency) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-500 bg-green-50 text-green-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 rounded-lg p-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Report Issue</h3>
          <p className="text-sm text-gray-600">{machine_name} (ID: {machine_id})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Describe the Issue *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Please provide a detailed description of the problem..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['low', 'medium', 'high', 'critical'] as ComplaintUrgency[]).map((level) => (
              <label
                key={level}
                className={`cursor-pointer border-2 rounded-lg p-3 text-center text-sm font-medium transition-colors ${
                  urgency === level 
                    ? getUrgencyColor(level)
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={level}
                  checked={urgency === level}
                  onChange={(e) => setUrgency(e.target.value as ComplaintUrgency)}
                  className="sr-only"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Attach Photo (Optional)
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Camera className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            {imageFile && (
              <span className="text-sm text-gray-600">{imageFile.name}</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!description.trim() || isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}