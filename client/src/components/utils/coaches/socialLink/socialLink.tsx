import { Edit3, ExternalLink } from "lucide-react";
import { SocialLink } from "@/types/coaches/socialLinks";
type Props = {
    socialLink: SocialLink;
    onEdit: (link: SocialLink) => void;
};

export default function SocialLinkCard({
    socialLink,
    onEdit,
}: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-700 hover:shadow-xl">

            <div className="flex items-start justify-between">

                <div>

                    <h3 className="text-xl font-semibold text-gray-900">
                        {socialLink.Platform}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        {socialLink.Tag}
                    </p>

                </div>

                <button
                    onClick={() => onEdit(socialLink)}
                    className="rounded-xl p-2 transition hover:bg-red-50"
                >
                    <Edit3
                        size={18}
                        className="text-red-700"
                    />
                </button>

            </div>

            <a
                href={socialLink.Url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 break-all text-red-700 hover:underline"
            >

                <ExternalLink size={16} />

                {socialLink.Url}

            </a>

        </div>
    );
}