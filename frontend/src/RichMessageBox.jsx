import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Mic, X, File, Upload } from 'lucide-react';

const RichMessageBox = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Process dropped files
    const newPreviewUrls = files.map(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setAttachments(prev => [...prev, ...files]);
  };

  // Handle clipboard paste
  const handlePaste = async (e) => {
    const items = Array.from(e.clipboardData.files);
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        // Don't prevent default immediately to allow both image and text paste
        const file = item;
        const previewUrl = URL.createObjectURL(file);
        
        setAttachments(prev => [...prev, file]);
        setPreviewUrls(prev => [...prev, previewUrl]);
        
        // Now prevent default to avoid double paste
        e.preventDefault();
      } else if (item.type === 'text/plain') {
        // Let the default paste behavior handle text
        item.getAsString((text) => {
          const cursorPosition = textareaRef.current?.selectionStart || 0;
          const textBefore = message.substring(0, cursorPosition);
          const textAfter = message.substring(cursorPosition);
          
          setMessage(textBefore + text + textAfter);
          
          if (textareaRef.current) {
            setTimeout(() => {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              // Set cursor position after paste
              textareaRef.current.selectionStart = 
              textareaRef.current.selectionEnd = cursorPosition + text.length;
            }, 0);
          }
        });
      }
    }
  };

  
  // Rest of the existing functions remain the same
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviewUrls = files.map(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setAttachments(prev => [...prev, ...files]);
  };

  // [Previous audio recording functions remain the same]
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new window.File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setAttachments(prev => [...prev, audioFile]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startRecordingTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

const startRecordingTimer = () => {
    const intervalId = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
    }, 1000);
};

  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      console.log('Sending message:', message);
      console.log('Attachments:', attachments);
      // send to server to upload files and send message using fetch api 
        
      // reset message and attachments
      setMessage('');
      setAttachments([]);
      setPreviewUrls([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
<div 
      ref={dropZoneRef}
      className={`w-full max-w-4xl mx-auto relative ${
        isDragging ? 'after:absolute after:inset-0 after:bg-blue-50 dark:after:bg-blue-950 after:border-2 after:border-dashed after:border-blue-500 after:rounded-lg after:z-10' : ''
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-white dark:bg-black-800 px-4 py-2 rounded-lg shadow-sm">
            <Upload className="w-5 h-5 text-blue-500" />
            <span className="text-blue-500">Drop files here</span>
          </div>
        </div>
      )}

      {/* Attachment previews */}
      {(attachments.length > 0 || previewUrls.some(url => url)) && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg border border-b-0 border-gray-200 dark:border-gray-700">
          {attachments.map((file, index) => (
            <div key={index} className="relative group">
              {previewUrls[index] ? (
                file.type.startsWith('image/') ? (
                  <img
                    src={previewUrls[index]}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : file.type.startsWith('audio/') ? (
                  <audio controls className="h-10">
                    <source src={previewUrls[index]} type={file.type} />
                    Your browser does not support the audio element.
                  </audio>
                ) : file.type.startsWith('video/') ? (
                  <video controls className="w-20 h-20">
                    <source src={previewUrls[index]} type={file.type} />
                    Your browser does not support the video element.
                  </video>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center">
                    <File className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      {file.name.slice(0, 10)}
                    </span>
                  </div>
                )
              ) : (
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center">
                  <File className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {file.name.slice(0, 10)}
                  </span>
                </div>
              )}
              <button
                onClick={() => handleRemoveFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*,application/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 focus:outline-none ${
            isRecording 
              ? 'text-red-500 animate-pulse' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>

        {isRecording && (
          <span className="text-red-500 text-sm mr-2">
            {formatTime(recordingTime)}
          </span>
        )}
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          placeholder="Type a message, paste or drop files here..."
          rows={1}
          className="flex-1 p-2 bg-transparent resize-none focus:outline-none max-h-48 min-h-[40px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        
        <button
          type="submit"
          disabled={!message.trim() && attachments.length === 0}
          className={`p-2 rounded-r-lg focus:outline-none ${
            message.trim() || attachments.length > 0
              ? 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300' 
              : 'text-gray-400 dark:text-gray-600'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
};

export default RichMessageBox;