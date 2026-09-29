"use client";

import { Award, Edit3 } from "lucide-react";
import Card from "../../ui/card";

type Specialization = {
    Id: string;
    Specialization: string;
};

type Props = {
    specialization: Specialization;
    onEdit: (specialization: Specialization) => void;
};

export default function SpecializationCard({ specialization, onEdit }: Props) {
    return (
        <Card>
            <div className="h-1 bg-red-700" />

            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                            <Award className="text-red-700" size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{specialization.Specialization}</h2>
                            <p className="mt-1 text-sm text-gray-500">Coach Specialization</p>
                        </div>
                    </div>

                    <button onClick={() => onEdit(specialization)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-700 transition hover:bg-red-50">
                        <Edit3 size={18} />
                        <span className="hidden sm:block">Edit</span>
                    </button>
                </div>

                <div className="my-5 border-t" />

                <div className="flex items-center justify-between">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Active</span>

                    <span className="text-xs text-gray-400">{specialization.Id.slice(0, 8)}</span>
                </div>
            </div>
        </Card>
    );
}