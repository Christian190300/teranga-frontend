import { useEffect, useRef, useState } from "react";

function IconCheck() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconClose() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

interface EditableFieldProps {
    id: string;
    label: string;
    value: string;
    onSave: (value: string) => void;
    placeholder?: string;
    type?: "text" | "number";
}

export function EditableField({ id, label, value, onSave, placeholder, type = "text" }: EditableFieldProps) {
    const [draft, setDraft] = useState(value);
    const [focused, setFocused] = useState(false);
    const dirty = draft !== value;
    const showActions = focused || dirty;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!focused) setDraft(value);
    }, [value, focused]);

    function confirmer() {
        onSave(draft);
        setFocused(false);
        inputRef.current?.blur();
    }

    function annuler() {
        setDraft(value);
        setFocused(false);
        inputRef.current?.blur();
    }

    return (
        <div className="profil-field">
            <label htmlFor={id}>{label}</label>
            <div className="profil-field__editable">
                <input
                    ref={inputRef}
                    id={id}
                    type={type}
                    value={draft}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            confirmer();
                        } else if (e.key === "Escape") {
                            e.preventDefault();
                            annuler();
                        }
                    }}
                    className={showActions ? "profil-field__input--with-actions" : ""}
                />
                {showActions && (
                    <div className="profil-field__actions">
                        <button
                            type="button"
                            className="profil-field__icon-btn profil-field__icon-btn--save"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={confirmer}
                            aria-label="Enregistrer"
                        >
                            <IconCheck />
                        </button>
                        <button
                            type="button"
                            className="profil-field__icon-btn profil-field__icon-btn--cancel"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={annuler}
                            aria-label="Annuler"
                        >
                            <IconClose />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}