
import React, { useState } from 'react';
import { Document } from '../types';
import { DocumentTextIcon, PlusCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from './icons';

interface DocumentEditorProps {
    onSave: (doc: Omit<Document, 'id'>) => void;
    onClose: () => void;
    documentToEdit?: Document; 
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ onSave, onClose, documentToEdit }) => {
    const [title, setTitle] = useState(documentToEdit?.title || '');
    const [content, setContent] = useState(documentToEdit?.content || '');

    const handleSave = () => {
        if (title && content) {
            onSave({ title, content });
            onClose();
        } else {
            alert('Please provide both a title and content.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {documentToEdit ? 'Edit Document' : 'Add Document'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        <XCircleIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 space-y-4">
                    <div>
                        <label htmlFor="doc-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                        <input
                            id="doc-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            placeholder="e.g., Wiley Treatment Plan Guide"
                        />
                    </div>
                    <div>
                        <label htmlFor="doc-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Content</label>
                        <textarea
                            id="doc-content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={15}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            placeholder="Paste your document content here..."
                        />
                    </div>
                </div>
                 <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700">
                        Save Document
                    </button>
                </div>
            </div>
        </div>
    );
};


interface DocumentManagerProps {
    documents: Document[];
    onDocumentsChange: (documents: Document[]) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, onDocumentsChange }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | undefined>(undefined);

    const handleAddClick = () => {
        setEditingDoc(undefined);
        setIsEditorOpen(true);
    };

    const handleEditClick = (doc: Document) => {
        setEditingDoc(doc);
        setIsEditorOpen(true);
    };

    const handleDelete = (docId: string) => {
        if(window.confirm('Are you sure you want to delete this document?')){
            onDocumentsChange(documents.filter(d => d.id !== docId));
        }
    };
    
    const handleSave = (docData: Omit<Document, 'id'>) => {
        if (editingDoc) {
            onDocumentsChange(documents.map(d => d.id === editingDoc.id ? { ...d, ...docData } : d));
        } else {
            const newDoc: Document = { id: Date.now().toString(), ...docData };
            onDocumentsChange([...documents, newDoc]);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                    <DocumentTextIcon className="w-6 h-6 mr-2 text-sky-600 dark:text-sky-400"/>
                    Background Documents
                </h2>
                <button
                    onClick={handleAddClick}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-800 transition-all"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Add Document
                </button>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Add documents, guidelines, or templates here. The AI will use them as a knowledge base to improve note quality. This is an ideal place to put content from Wiley Treatment Planners or agency-specific guides.
            </p>

            <div className="space-y-2">
                {documents.length > 0 ? (
                    documents.map(doc => (
                        <div key={doc.id} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md flex justify-between items-center">
                            <p className="font-medium text-slate-900 dark:text-white">{doc.title}</p>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEditClick(doc)} className="text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400" aria-label={`Edit ${doc.title}`}>
                                    <PencilIcon className="w-5 h-5"/>
                                </button>
                                <button onClick={() => handleDelete(doc.id)} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400" aria-label={`Delete ${doc.title}`}>
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 px-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <p className="text-sm text-slate-500 dark:text-slate-400">No background documents added yet.</p>
                    </div>
                )}
            </div>

            {isEditorOpen && <DocumentEditor onClose={() => setIsEditorOpen(false)} onSave={handleSave} documentToEdit={editingDoc} />}
        </div>
    );
};

export default DocumentManager;
