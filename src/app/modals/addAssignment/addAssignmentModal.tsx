
import React, { useState } from 'react';
import { AssignmentType, Category } from '@/types/types';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Style from '../modals.module.scss';
import { User } from '@/context/authContext';

interface AddAssignmentModalProps {
    onClose: () => void;
    user: User;
    useAi: boolean;
}

export default function AddAssignmentModal({
    onClose,
    user,
    useAi,
}: AddAssignmentModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [formData, setFormData] = useState<AssignmentType>({
        Id: Date.now(),
        UserId: user.uid,
        Costumer: '',
        TicketName: '',
        Status: 'Unknown',
        CreatedDate: new Date().toISOString().split('T')[0],
        Description: '',
        ActualTime: 0,
        Sessions: [],
        Category: 'Bugg' as Category,
        Completed: false,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (
            !formData.Costumer ||
            !formData.TicketName ||
            !formData.Description
        ) {
            setError('Vänligen fyll i alla obligatoriska fält.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await setDoc(doc(db, user.uid, formData.Id.toString()), formData);
            setError(null);
            onClose();
        } catch (error) {
            console.error('Fel vid sparande av uppdrag:', error);
            setError('Kunde inte spara uppdraget. Försök igen.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAiSave = async () => {
        if (!aiPrompt) {
            setError('Vänligen ange en beskrivning för AI.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `
                        Du är en assistent som tolkar fritext och skapar ett JSON-objekt för ett nytt uppdrag. 
                        Plocka ut och mappa följande fält från texten, även om användaren inte skriver ut fältnamnen:
                        - Costumer (kundens namn, t.ex. företagsnamn eller person)
                        - TicketName (ticketnummer eller titel, t.ex. "Ticket-123412")
                        - Category (Bugg, Utveckling eller Konfiguration)
                        - Description (beskrivning av ärendet)

                        För TicketName, identifiera ticketnummer som börjar med varianter av "Ticket"
                        (t.ex. "Tickgeit", "Tcket", "Ticket-") och formatera till "Ticket-<nummer>".
                        Om numret är ogiltigt, använd en tom sträng.

                        För att bestämma Category, analysera textens kontext och använd följande riktlinjer:
                        - Välj "Bugg" om texten nämner fel, problem, krasch, "ligger nere", "fungerar inte" eller liknande tekniska issue.
                        - Välj "Utveckling" om texten nämner ny funktionalitet, utveckling, kod, implementering eller liknande.
                        - Välj "Konfiguration" om texten nämner inställningar, konfigurering, setup eller ändringar i systemkonfiguration.
                        - Om du är osäker, välj "Bugg" som standard.

                        Exempel:
                        Indata: "David på Vasakronan kan inte logga in då servern ligger nere, Ticket-3322134"
                        Utdata: {
                            "Costumer": "Vasakronan",
                            "TicketName": "Ticket-3322134",
                            "Category": "Bugg",
                            "Description": "David kan inte logga in då servern ligger nere"
                        }

                        Här är användarens text: ${aiPrompt}
                        Returnera ENDAST ett JSON-objekt. Om något fält inte kan identifieras, använd tomma strängar för Costumer, TicketName och Description, och "Bugg" för Category.
                    `,
                }),
            });
            if (!response.ok) {
                throw new Error(
                    `API-anrop misslyckades: ${response.statusText}`
                );
            }
            const data = await response.json();
            let aiData: Partial<AssignmentType>;
            try {
                // Försök parsa JSON direkt från data.text
                aiData = JSON.parse(data.text);
            } catch (parseError) {
                // Fallback: Försök matcha JSON-objekt med regex
                console.log('Fel vid parsing av AI-svar:', parseError);
                const match = data.text.match(/\{[\s\S]*\}/);
                if (!match) {
                    throw new Error(
                        'Ogiltigt AI-svar: Inget JSON-objekt hittades'
                    );
                }
                aiData = JSON.parse(match[0]);
            }

            // Validera och sätt fallback-värden
            aiData = {
                Costumer: aiData.Costumer || '',
                TicketName: aiData.TicketName || '',
                Description: aiData.Description || '',
                Category: ['Bugg', 'Utveckling', 'Konfiguration'].includes(
                    aiData.Category as Category
                )
                    ? aiData.Category
                    : 'Bugg',
            };

            // Kontrollera obligatoriska fält
            if (!aiData.Costumer || !aiData.TicketName || !aiData.Description) {
                throw new Error(
                    'Ogiltigt AI-svar: Saknar obligatoriska fält (kundnamn, ticketnamn eller beskrivning)'
                );
            }

            const newAssignment: AssignmentType = {
                ...formData,
                ...aiData,
            };
            await setDoc(
                doc(db, user.uid, newAssignment.Id.toString()),
                newAssignment
            );
            setError(null);
            onClose();
        } catch (error) {
            console.error('Fel vid AI-sparande:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Kunde inte tolka AI-svaret. Försök igen.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={Style.modal}>
            <div className={Style.modalContent}>
                <h2>Skapa nytt uppdrag</h2>
                {error && <div className={Style.error}>{error}</div>}
                {isLoading && <div className={Style.loading}>Sparar...</div>}
                <form className={Style.modalForm}>
                    {useAi ? (
                        <div className={Style.inputRow}>
                            <textarea
                                name='aiPrompt'
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder='Beskriv ditt uppdrag...'
                                required
                                maxLength={1000} // NY: Begränsa längd
                            />
                            <div className={Style.aiPromptHelp}>
                                <small>
                                    <b>Exempel:</b> Sisab, TICKET-233122,
                                    konfig, Starta rondering på fastighet
                                </small>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={Style.inputRow}>
                                <label htmlFor='Costumer'>Kundnamn</label>
                                <input
                                    id='Costumer'
                                    type='text'
                                    name='Costumer'
                                    value={formData.Costumer}
                                    onChange={handleChange}
                                    required
                                    placeholder='Kundnamn...'
                                />
                            </div>
                            <div className={Style.inputRow}>
                                <label htmlFor='TicketName'>Ticketnamn</label>
                                <input
                                    id='TicketName'
                                    type='text'
                                    name='TicketName'
                                    value={formData.TicketName}
                                    onChange={handleChange}
                                    required
                                    placeholder='Ticketnamn...'
                                />
                            </div>
                            <div className={Style.inputRow}>
                                <label htmlFor='Category'>Kategori</label>
                                <select
                                    id='Category'
                                    name='Category'
                                    value={formData.Category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='Bugg'>Bugg</option>
                                    <option value='Utveckling'>
                                        Utveckling
                                    </option>
                                    <option value='Konfiguration'>
                                        Konfiguration
                                    </option>
                                </select>
                            </div>
                            <div className={Style.inputRow}>
                                <label htmlFor='Description'>Beskrivning</label>
                                <textarea
                                    id='Description'
                                    name='Description'
                                    value={formData.Description}
                                    onChange={handleChange}
                                    required
                                    placeholder='Beskrivning...'
                                ></textarea>
                            </div>
                        </>
                    )}
                </form>
                <div className={Style.modalActions}>
                    <button
                        onClick={onClose}
                        className={Style.cancelButton}
                        disabled={isLoading}
                    >
                        Avbryt
                    </button>
                    <button
                        onClick={useAi ? handleAiSave : handleSave}
                        className={Style.saveButton}
                        disabled={isLoading}
                    >
                        Spara
                    </button>
                </div>
            </div>
        </div>
    );
}
