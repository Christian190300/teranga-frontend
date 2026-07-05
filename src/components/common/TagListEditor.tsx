import { useState } from "react";

interface TagListEditorProps {
    values: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
    emptyLabel: string;
}

export function TagListEditor({ values, onChange, placeholder, emptyLabel }: TagListEditorProps) {
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
            />
        </div>
    );
}