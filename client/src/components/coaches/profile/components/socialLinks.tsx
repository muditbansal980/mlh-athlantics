import { SocialLink } from '@/types/coaches/socialLinks'
import {useRouter} from 'next/navigation'
export default function CoachSocialLinks({ socialLinks, coachId, allowed }: { socialLinks: SocialLink[]; coachId: string; allowed: boolean }) {
    const router = useRouter();
    return (
        <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-3">Reach out to me</h3>
            {
                socialLinks.length === 0 ? (
                    <div className="flex items-center justify-center h-24 border-dashed border-neutral-200">
                        <p className="text-sm text-red-600 hover:underline">No way available</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-sm">
                        {socialLinks?.map((link) => (

                            <div key={link.Id} className="flex items-center justify-between text-sm py-1 border-b border-neutral-100 last:border-0">
                                <span className="text-neutral-500">{link.Platform}</span>
                                <a
                                    href={link.Url}
                                    className="font-medium text-red-600 hover:underline"
                                >
                                    {link.Tag || "Link"}
                                </a>
                            </div>
                        )
                        )}
                    </div>

                )
            }
            {
                allowed && (
                    <div className="pt-4">
                        <button onClick={() => router.push(`/profile/coach/${coachId}/edit/socialLinks`)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">+ Add Social Link</button>
                    </div>
                )
            }
        </div>
    )
}