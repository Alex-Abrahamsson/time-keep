import React, { useState } from 'react';
import { AssignmentType } from '@/types/types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Style from '../modals.module.scss';
import { User } from '@/context/authContext';

interface AddAssignmentModalProps {
  onClose: () => void;
  user: User;
}

export default function AddAssignmentModal({ onClose, user }: AddAssignmentModalProps) {

  const [formData, setFormData] = useState<AssignmentType>({
    Id: Date.now(),
    UserId: user.uid,
    Costumer: '',
    TicketName: '',
    Status: 'Paused',
    Date: new Date().toISOString().split('T')[0],
    Description: '',
    Time: '00:00',
    Sessions: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, user.uid), formData);
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
              name="Costumer"
              value={formData.Costumer}
              onChange={handleChange}
              required
              placeholder='Kundnamn...'
            />
          </div>
          <div className={Style.inputRow}>
            <input
              type="text"
              name="TicketName"
              value={formData.TicketName}
              onChange={handleChange}
              required
              placeholder='Ticketnamn...'
            />
          </div>
          <div className={Style.inputRow}>
            <textarea
              name="Description"
              value={formData.Description}
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