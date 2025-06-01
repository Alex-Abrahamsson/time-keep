declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

import React, { useState } from 'react';
import { AssignmentType } from '@/types/types';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Style from '../modals.module.scss';
import { User } from '@/context/authContext';

interface AddAssignmentModalProps {
    onClose: () => void;
    user: User;
}
type SpeechRecognitionEvent = {
    results: SpeechRecognitionResultList;
};
type SpeechRecognitionErrorEvent = {
    error: string;
};

export default function AddAssignmentModal({
    onClose,
    user,
}: AddAssignmentModalProps) {
    const [formData, setFormData] = useState<
        AssignmentType & { Category: string }
    >({
        Id: Date.now(),
        UserId: user.uid,
        Costumer: '',
        TicketName: '',
        Status: 'Paused',
        Date: new Date().toISOString().split('T')[0],
        Description: '',
        Time: 0,
        Sessions: [],
        Category: 'Bugg',
    });
    const [listening, setListening] = useState(false);

    const handleSpeechToText = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Din webbläsare stödjer inte taligenkänning.');
            return;
        }
        const recognition = new (SpeechRecognition)();
        recognition.lang = 'sv-SE';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            handleAI(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setListening(false);
            alert('Fel vid taligenkänning: ' + event.error);
        };

        recognition.start();
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await setDoc(doc(db, user.uid, formData.Id.toString()), formData);
            alert('Uppdrag sparat!');
            onClose();
        } catch (error) {
            console.error('Fel vid sparande av uppdrag:', error);
            alert('Kunde inte spara uppdraget.');
        }
    };

    const handleAI = async (userPrompt?: string) => {
        if (!userPrompt) {
            userPrompt =
                prompt(
                    "Beskriv ditt uppdrag (t.ex. 'Skapa ett uppdrag för kunden Acme AB, ticketnamn Buggrapport, kategori Bugg, beskrivning: Fel vid inloggning.')"
                ) ?? undefined; // Konvertera null till undefined
            if (!userPrompt) return;
        }
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `Returnera ett JSON-objekt för ett nytt uppdrag med fälten Costumer, TicketName, Category, Description. Här är instruktionen: ${userPrompt}`,
            }),
        });
        const data = await response.json();
        console.log('AI-svar:', data.text);
        try {
            const aiData = JSON.parse(
                data.text.match(/\{[\s\S]*\}/)?.[0] ?? '{}'
            );
            setFormData((prev) => ({
                ...prev,
                ...aiData,
            }));
        } catch {
            alert('Kunde inte tolka AI-svaret.');
        }
    };

    return (
        <div className={Style.modal}>
            <div className={Style.modalContent}>
                <h2>Skapa nytt uppdrag</h2>
                <form className={Style.modalForm}>
                    <div className={Style.inputRow}>
                        <input
                            type='text'
                            name='Costumer'
                            value={formData.Costumer}
                            onChange={handleChange}
                            required
                            placeholder='Kundnamn...'
                        />
                    </div>
                    <div className={Style.inputRow}>
                        <input
                            type='text'
                            name='TicketName'
                            value={formData.TicketName}
                            onChange={handleChange}
                            required
                            placeholder='Ticketnamn...'
                        />
                    </div>
                    <div className={Style.inputRow}>
                        <select
                            name='Category'
                            value={formData.Category}
                            onChange={handleChange}
                            required
                        >
                            <option value='Bugg'>Bugg</option>
                            <option value='Utveckling'>Utveckling</option>
                            <option value='Konfiguration'>Konfiguration</option>
                        </select>
                    </div>
                    <div className={Style.inputRow}>
                        <textarea
                            name='Description'
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
                    <button
                        onClick={() => handleAI()}
                        className={Style.aiButton}
                    >
                        Fyll i automatiskt med AI
                    </button>
                    <button onClick={handleSpeechToText}>
                        {listening ? 'Lyssnar...' : '🎤 Prata in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
