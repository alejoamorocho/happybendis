import React from 'react';

interface ChildInfo {
  name: string;
  birthdate: string;
  gender: string;
}

interface ChildInfoFormProps {
  childInfo: ChildInfo;
  onChange: (info: ChildInfo) => void;
  disabled?: boolean;
}

export const ChildInfoForm: React.FC<ChildInfoFormProps> = ({
  childInfo,
  onChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...childInfo,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
          Nombre del Niño/a
        </label>
        <input
          type="text"
          id="childName"
          name="name"
          value={childInfo.name}
          onChange={handleChange}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Nombre de tu hijo/a"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="childBirthdate" className="block text-sm font-medium text-gray-700">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          id="childBirthdate"
          name="birthdate"
          value={childInfo.birthdate}
          onChange={handleChange}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="childGender" className="block text-sm font-medium text-gray-700">
          Género
        </label>
        <select
          id="childGender"
          name="gender"
          value={childInfo.gender}
          onChange={handleChange}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          aria-label="Selecciona el género"
        >
          <option value="">Selecciona una opción</option>
          <option value="male">Niño</option>
          <option value="female">Niña</option>
          <option value="other">Otro</option>
        </select>
      </div>
    </div>
  );
};

export default ChildInfoForm;
