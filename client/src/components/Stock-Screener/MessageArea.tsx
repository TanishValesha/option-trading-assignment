// src/components/MessageArea.tsx
import React from 'react';

interface MessageAreaProps {
    message: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({ message }) => {
    if (!message) return null;
    return (
        <div className="text-center text-gray-500 mt-10" id="message-area">
            {message}
        </div>
    );
};

export default MessageArea;