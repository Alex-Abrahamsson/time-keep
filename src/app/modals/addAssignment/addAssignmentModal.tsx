import React, { useState } from 'react';
import { AssignmentType } from '@/types/types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Style from '../modals.module.scss';

interface AddAssignmentModalProps {
  onClose: () => void;
}

export default function AddAssignmentModal({ onClose }: AddAssignmentModalProps) {
  const [formData, setFormData] = useState<AssignmentType>({
    id: Date.now(), // Generate a unique ID
    costumer: '',
    ticketName: '',
    status: 'Paused',
    date: new Date().toISOString().split('T')[0],
    description: '',
    time: '00:00',
    startTime: null,
    endTime: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, 'assignments'), formData);
      alert('Uppdrag sparat!');
      onClose();
    } catch (error) {
      console.error('Fel vid sparande av uppdrag:', error);
      alert('Kunde inte spara uppdraget.');
    }
  };

  return (
    <div className={Style.modal}>
      <div className={Style.modalContent}>
        <h2>Skapa nytt uppdrag</h2>
        <form className={Style.modalForm}>
            <div className={Style.inputRow}>
                <input
                type="text"
                name="costumer"
                value={formData.costumer}
                onChange={handleChange}
                required
                placeholder='Kundnamn...'
                />
            </div>
            <div className={Style.inputRow}>
                <input
                type="text"
                name="ticketName"
                value={formData.ticketName}
                onChange={handleChange}
                required
                placeholder='Ticketnamn...'
                />
            </div>
            <div className={Style.inputRow}>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder='Beskrivning...'
                ></textarea>
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