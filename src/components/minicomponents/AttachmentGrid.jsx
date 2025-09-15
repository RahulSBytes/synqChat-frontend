import { X, Play, Pause, Download, FileText, File, Eye, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {  textFiles } from '../constants/constants';

const AttachmentGrid = ({ attachments }) => {
  const [viewAll, setViewAll] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [mediaPopup, setMediaPopup] = useState(null);
  const audioRefs = useRef({});
  const videoRef = useRef(null);

  if (attachments.length === 0) return null;

  // Separate attachments by type
  const mediaAttachments = attachments.filter(att => att.fileType === 'image' || att.fileType === 'video');
  const nonMediaAttachments = attachments.filter(att => att.fileType === 'audio' || att.fileType === 'raw');

  const formatFileSize = (size) => {
    return size || '';
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'raw':
        return <FileText size={20} />;
      case 'audio':
        return <Music size={20} />;
      default:
        return <File size={20} />;
    }
  };

  const handleAudioPlay = async (attachment, e) => {
    e?.stopPropagation();

    const audioId = attachment.public_id;
    const currentAudio = audioRefs.current[audioId];

    if (playingAudio === audioId && currentAudio) {
      currentAudio.pause();
      setPlayingAudio(null);
    } else {
      // Pause all other audio
      Object.values(audioRefs.current).forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
        }
      });

      if (!currentAudio) {
        // Create new audio element
        const audio = new Audio(attachment.url);
        audioRefs.current[audioId] = audio;

        audio.onended = () => setPlayingAudio(null);
        audio.onerror = () => {
          console.error('Error playing audio');
          setPlayingAudio(null);
        };

        try {
          await audio.play();
          setPlayingAudio(audioId);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      } else {
        try {
          await currentAudio.play();
          setPlayingAudio(audioId);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const handleDocumentOpen = (attachment, e) => {
    e.stopPropagation();
    setMediaPopup(attachment);
  };

  const handleMediaClick = (attachment, e) => {
    e.stopPropagation();
    setMediaPopup(attachment);
  };

  const handleDownload = async (attachment, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) { console.error("Download failed:", err); }
  };

  const closeMediaPopup = () => {
    setMediaPopup(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Cleanup audio references
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Media popup component
  const MediaPopup = ({ attachment }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <button
          onClick={closeMediaPopup}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl z-10 bg-black bg-opacity-50 rounded-full p-2"
        >
          <X size={24} />
        </button>

        {attachment.fileType === 'image' ? (
          <img
            className="w-full h-full object-contain rounded-lg"
            src={attachment.url}
            alt={attachment.filename}
          />
        ) : attachment.fileType === 'video' ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain rounded-lg"
            src={attachment.url}
            controls
            autoPlay
          />
        ) : attachment.fileType === 'audio' ? (
          <div className="bg-zinc-900 rounded-lg p-8 text-center">
            <div className="text-white mb-4">
              <div className="text-xl font-medium mb-2">{attachment.filename}</div>
              <div className="text-gray-400">{formatFileSize(attachment.fileSize)}</div>
            </div>
            <audio
              className="w-full"
              src={attachment.url}
              controls
              autoPlay
            />
          </div>
        ) : attachment.fileType === 'raw' ? (
          <DocumentViewer attachment={attachment} />
        ) : null}

        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          {formatFileSize(attachment.fileSize)}
        </div>
      </div>
    </div>
  );

  // Document viewer component
  const DocumentViewer = ({ attachment }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      const extension = attachment.filename
        ? attachment.filename.split('.').pop().toLowerCase()
        : '';

      const textBasedFiles = textFiles;
      const officeFiles = [
        'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'
      ];

      const fetchContent = async () => {
        try {
          if (textBasedFiles.includes(extension)) {
            const response = await fetch(attachment.url);
            const text = await response.text();
            setContent({ type: 'text', value: text });
          } else if (officeFiles.includes(extension)) {
            setContent({
              type: 'iframe',
              value: `https://docs.google.com/viewer?url=${encodeURIComponent(
                attachment.url
              )}&embedded=true`
            });
          } else {
            // fallback: try to render in an iframe
            setContent({ type: 'iframe', value: attachment.url });
          }
        } catch (err) {
          console.error('Error fetching document:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchContent();
    }, [attachment.url, attachment.filename]);

    if (loading) {
      return (
        <div className="bg-zinc-900 rounded-lg p-8 text-center text-white">
          <div>Loading document...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-zinc-900 rounded-lg p-8 text-center text-white">
          <div className="mb-4">Unable to preview this document</div>
          <button
            onClick={() => window.open(attachment.url, '_blank')}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Open in New Tab
          </button>
        </div>
      );
    }

    if (content?.type === 'text') {
      return (
        <div className="bg-white rounded-lg max-h-[80vh] overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <div className="font-medium text-gray-900">{attachment.filename}</div>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
              {content.value}
            </pre>
          </div>
        </div>
      );
    }

    if (content?.type === 'iframe') {
      return (
        <iframe
          src={content.value}
          title={attachment.filename}
          className="w-full h-[80vh] bg-white rounded-lg"
        />
      );
    }

    return null;
  };

  if (viewAll) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
          <div className="sticky top-0 bg-zinc-900/95 p-3 flex justify-between items-center border-b border-zinc-700">
            <h3 className="font-medium text-white">All Media ({mediaAttachments.length})</h3>
            <button
              onClick={() => setViewAll(false)}
              className="text-gray-400 hover:text-gray-200 text-xl"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {mediaAttachments.map((attachment, index) => (
                <div
                  key={attachment.public_id}
                  className="relative aspect-square rounded overflow-hidden cursor-pointer hover:opacity-80"
                  onClick={(e) => handleMediaClick(attachment, e)}
                >
                  {attachment.fileType === 'image' ? (
                    <img
                      className="w-full h-full object-cover"
                      src={attachment.url}
                      alt={`Attachment ${index + 1}`}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        className="w-full h-full object-cover"
                        src={attachment.url}
                        poster=""
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white bg-opacity-80 rounded-full p-2">
                          <Play size={16} className="text-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="text-xs text-white">{formatFileSize(attachment.fileSize)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxVisible = 4;
  const shouldShowViewAll = mediaAttachments.length > maxVisible;
  const visibleAttachments = mediaAttachments.slice(0, maxVisible);
  const hiddenMediaCount = mediaAttachments.length - maxVisible;

  const getGridClasses = (count) => {
    return count === 1 ? "grid-cols-1" : "grid-cols-2";
  };

  const getImageClasses = (index, total) =>
    total === 3 && index === 0
      ? "col-span-2 aspect-[2/1]"
      : "col-span-1 aspect-square";

  return (
    <div className="w-full max-w-lg space-y-2">
      {/* Media grid - only show if there are media attachments */}
      {mediaAttachments.length > 0 && (
        <div className="w-full">
          <div
            className={`grid ${getGridClasses(Math.min(mediaAttachments.length, maxVisible))} gap-1 rounded-lg overflow-hidden w-full ${shouldShowViewAll ? 'cursor-pointer' : ''}`}
            onClick={shouldShowViewAll ? () => setViewAll(true) : undefined}
          >
            {visibleAttachments.map((attachment, index) => (
              <div
                key={attachment.public_id}
                className={`relative ${getImageClasses(index, Math.min(mediaAttachments.length, maxVisible))} overflow-hidden ${!shouldShowViewAll ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={!shouldShowViewAll ? (e) => handleMediaClick(attachment, e) : undefined}
              >
                {attachment.fileType === 'image' ? (
                  <img
                    className="w-full h-full object-cover"
                    src={attachment.url}
                    alt={`Attachment ${index + 1}`}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      className="w-full h-full object-cover"
                      src={attachment.url}
                      poster=""
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="bg-white bg-opacity-80 rounded-full p-3">
                        <Play size={20} className="text-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* File size overlay */}
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                  {formatFileSize(attachment.fileSize)}
                </div>

                {/* Overlay for additional attachments count */}
                {index === maxVisible - 1 && shouldShowViewAll && hiddenMediaCount > 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      +{hiddenMediaCount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-media files as strips (always rendered) */}
      {nonMediaAttachments.length > 0 && (
        <div className="space-y-1 w-full">
          {nonMediaAttachments.map((attachment) => (
            <div
              key={attachment.public_id}
              className="bg-zinc-100 rounded p-2 flex items-center gap-2 w-full"
            >
              <div className="text-gray-600 flex-shrink-0">
                {getFileIcon(attachment.fileType)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 truncate">{attachment.filename}</div>
                <div className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {attachment.fileType === 'audio' && (
                  <button
                    onClick={(e) => handleAudioPlay(attachment, e)}
                    className="text-blue-500 hover:text-blue-600 p-1"
                    title={playingAudio === attachment.public_id ? 'Pause' : 'Play'}
                  >
                    {playingAudio === attachment.public_id ?
                      <Pause size={16} /> : <Play size={16} />
                    }
                  </button>
                )}

                {attachment.fileType === 'raw' && (
                  <button
                    onClick={(e) => handleDocumentOpen(attachment, e)}
                    className="text-green-500 hover:text-green-600 p-1"
                    title="Open"
                  >
                    <Eye size={16} />
                  </button>
                )}

                <button
                  onClick={(e) => handleDownload(attachment, e)}
                  className="text-gray-500 hover:text-gray-600 p-1"
                  title="Download"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media popup */}
      {mediaPopup && <MediaPopup attachment={mediaPopup} />}
    </div>
  );
};

export default AttachmentGrid;