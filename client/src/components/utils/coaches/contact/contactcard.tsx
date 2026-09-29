import { Edit3, ExternalLink } from "lucide-react";
import { Contact } from "@/types/coaches/contact";
type Props = {
    contact: Contact;
    onEdit: (contact: Contact) => void;
};

export default function ContactCard({
    contact,
    onEdit,
}: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-700 hover:shadow-xl">

            <div className="flex items-start justify-between">

                <div>

                    <h3 className="text-xl font-semibold text-gray-900">
                        {contact.Label}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        {contact.Value}
                    </p>

                </div>

                <button
                    onClick={() => onEdit(contact)}
                    className="rounded-xl p-2 transition hover:bg-red-50"
                >
                    <Edit3
                        size={18}
                        className="text-red-700"
                    />
                </button>

            </div>
        </div>
    );
}