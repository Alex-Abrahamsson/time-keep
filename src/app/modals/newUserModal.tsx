import React, { useState } from 'react';
import { UserType } from '@/types/types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Style from './modals.module.scss';

interface AddAssignmentModalProps {
  onClose: () => void;
}

export default function NewUserModal({ onClose }: AddAssignmentModalProps) {

  const [formData, setFormData] = useState<UserType>({
    Id: Date.now(),
    Name: '',
    Email: '',
    Password: '',
    Role: 'User',
    CreatedAt: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "Users"), formData);
      alert('Användare sparad!');
      onClose();
    } catch (error) {
      console.error('Fel vid sparande av användare:', error);
      alert('Kunde inte spara användare.');
    }
  };

  return (
    <div className={Style.modal}>
      <div className={Style.modalContent}>
        <h2>Skapa ny användare</h2>
        <form className={Style.modalForm}>
          <div className={Style.inputRow}>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              placeholder='Användarnamn...'
            />
          </div>
          <div className={Style.inputRow}>
            <input
              type="text"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              placeholder='Lösenord...'
            />
          </div>
          <div className={Style.inputRow}>
            <input
              type="text"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              placeholder='Email...'
            />
          </div>
        </form>
        <div className={Style.modalActions}>
          <button onClick={onClose} className={Style.cancelButton}>
            Avbryt
          </button>
          <button onClick={handleSave} className={Style.saveButton}>
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}