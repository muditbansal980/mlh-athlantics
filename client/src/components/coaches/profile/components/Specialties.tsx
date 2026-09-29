
export function SpecialitiesTabs({ specialties }: { specialties: {Id: string; Specialization: string }[] }) {
    return (
        <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
                {specialties.map((spec, i) => (
                    <span
                        key={i}
                        className="bg-neutral-100 text-neutral-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200/60"
                    >
                        {spec.Specialization}
                    </span>
                ))}
            </div>
        </div>
    )
}