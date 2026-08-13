import { useState } from "react";

interface TagListEditorProps {
    values: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
    emptyLabel: string;
    exemple?: string;
}

function IconPlus() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function TagListEditor({ values, onChange, placeholder, emptyLabel, exemple }: TagListEditorProps) {
    const [nouvelleValeur, setNouvelleValeur] = useState("");

    function ajouter() {
        const value = nouvelleValeur.trim();
        if (value && !values.includes(value)) {
            onChange([...values, value]);
        }
        setNouvelleValeur("");
    }

    function retirer(value: string) {
        onChange(values.filter((v) => v !== value));
    }

    const peutAjouter = nouvelleValeur.trim().length > 0;

    return (
        <div className="profil-field">
            {values.length > 0 ? (
                <div className="profil-tags">
                    {values.map((value) => (
                        <span className="profil-tag" key={value}>
                            {value}
                            <button
                                type="button"
                                className="profil-tag__remove"
                                onClick={() => retirer(value)}
                                aria-label={`Retirer ${value}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <p className="profil-tags-empty">{emptyLabel}</p>
            )}

            <div className="tag-editor__add-row">
                <input
                    value={nouvelleValeur}
                    onChange={(e) => setNouvelleValeur(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            ajouter();
                        }
                    }}
                    placeholder={placeholder}
                    className="tag-editor__input"
                />
                <button
                    type="button"
                    className="tag-editor__add-btn"
                    onClick={ajouter}
                    disabled={!peutAjouter}
                    aria-label="Ajouter"
                >
                    <IconPlus />
                    Ajouter
                </button>
            </div>

            {exemple && <p className="tag-editor__exemple">Exemple : {exemple}</p>}
        </div>
    );
}