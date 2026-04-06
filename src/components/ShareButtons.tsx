import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareButtonsProps {
  title: string;
  text: string;
  url: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, text, url }) => {
  const [copied, setCopied] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);

  const shareData = {
    title,
    text,
    url: url || window.location.href,
  };

  const handleWebShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        setShowOptions(!showOptions);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      setShowOptions(!showOptions);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      color: 'hover:bg-[#1877F2] hover:text-white',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
      color: 'hover:bg-[#1DA1F2] hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
      color: 'hover:bg-[#0A66C2] hover:text-white',
    },
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={handleWebShare}
        className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-full text-[10px] uppercase tracking-widest font-bold text-on-surface transition-all"
      >
        <Share2 className="w-3 h-3" /> Chia sẻ
      </button>

      <AnimatePresence>
        {showOptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 z-50 bg-surface-container-highest border border-outline-variant/30 rounded-xl shadow-2xl p-2 min-w-[180px]"
            >
              <div className="flex flex-col gap-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-on-surface transition-all ${link.color}`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-on-surface hover:bg-primary hover:text-on-primary transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép liên kết'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
