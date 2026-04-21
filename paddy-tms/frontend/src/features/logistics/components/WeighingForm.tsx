'use client';

import React, { useState } from 'react';
import { Truck, WeighingData } from '../types/logistics.types';
import { validateWeight, validateMoistureLevel } from '../utils/validation';

interface WeighingFormProps {
  truckId: string;
  onSubmit?: (data: WeighingData) => Promise<void>;
  onCancel?: () => void;
}

export const WeighingForm: React.FC<WeighingFormProps> = ({ truckId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<WeighingData>({
    truckId,
    weight: 0,
    moistureLevel: undefined,
    quality: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateWeight(formData.weight)) {
      newErrors.weight = 'Weight must be between 0 and 100000 kg';
    }

    if (formData.moistureLevel !== undefined && !validateMoistureLevel(formData.moistureLevel)) {
      newErrors.moistureLevel = 'Moisture level must be between 0 and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData({
        truckId,
        weight: 0,
        moistureLevel: undefined,
        quality: '',
        notes: '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg) *
        </label>
        <input
          type="number"
          required
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
          className={`
            w-full px-3 py-2 border rounded-md text-sm
            ${errors.weight ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          placeholder="Enter weight"
          disabled={isSubmitting}
        />
        {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Moisture Level (%)
        </label>
        <input
          type="number"
          value={formData.moistureLevel || ''}
          onChange={(e) => setFormData({ ...formData, moistureLevel: e.target.value ? parseFloat(e.target.value) : undefined })}
          className={`
            w-full px-3 py-2 border rounded-md text-sm
            ${errors.moistureLevel ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          placeholder="Enter moisture level"
          disabled={isSubmitting}
        />
        {errors.moistureLevel && <p className="text-red-500 text-xs mt-1">{errors.moistureLevel}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quality
        </label>
        <input
          type="text"
          value={formData.quality}
          onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quality assessment"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
          placeholder="Additional notes"
          disabled={isSubmitting}
        />
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Weighing'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
