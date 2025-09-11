import { X } from 'lucide-react';
import { useState } from 'react';


const AttachmentGrid = ({ attachments }) => {
  const [viewAll, setViewAll] = useState(false);
  
  if (attachments.length === 0) return null;

  if (viewAll) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
        <div className="bg-transparent rounded-lg max-w-md w-full max-h-[80vh] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
          <div className="sticky top-0 bg-zinc-900/60 p-3 flex justify-between items-center">
            <h3 className="font-medium ">All Attachments ({attachments.length})</h3>
            <button 
              onClick={() => setViewAll(false)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
            <X size={22} strokeWidth={4} />
            </button>
          </div>
          <div className="p-3 space-y-2">
            {attachments.map((attachment, index) => (
              <img 
                key={attachment.public_id}
                className="w-full rounded object-cover"
                src={attachment.url} 
                alt={`Attachment ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxVisible = 4;
  const visibleAttachments = attachments.slice(0, maxVisible);
  const hiddenCount = attachments.length - maxVisible;

  const getGridClasses = (count) => {
return count === 1 ? "grid-cols-1" : "grid-cols-2";
  };

  const getImageClasses = (index, total) =>
  total === 3 && index === 0
    ? "col-span-2 aspect-[2/1]"
    : "col-span-1 aspect-square";


  return (
    <div 
      className={`grid ${getGridClasses(Math.min(attachments.length, maxVisible))} gap-1 rounded-lg overflow-hidden cursor-pointer`}
      onClick={() => setViewAll(true)}
    >
      {visibleAttachments.map((attachment, index) => (
        <div 
          key={attachment.public_id} 
          className={`relative ${getImageClasses(index, Math.min(attachments.length, maxVisible))} overflow-hidden`}
        >
          <img 
            className="w-full h-full object-cover" 
            src={attachment.url}
          />
          
          {/* Overlay for additional attachments count */}
          {index === maxVisible - 1 && hiddenCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                +{hiddenCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default AttachmentGrid;