import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { sendMessage } from '../services/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  data?: any;
}

interface ChatInterfaceProps {
  onParkDataUpdate: (data: any) => void;
  selectedParkId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onParkDataUpdate,
  selectedParkId,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CityRoots AI assistant. Ask me about parks in your area, such as:\n\n• "Show parks in Austin"\n• "Show parks in zipcode 24060"\n• "What\'s the area of this park?"\n• "What happens if this park is removed?"\n• "What\'s the NDVI of this park?"\n\nStart by searching for parks in your area!',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 11));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue, selectedParkId, sessionId);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isUser: false,
        timestamp: new Date(),
        data: response.data,
      };

      setMessages(prev => [...prev, botMessage]);

      if (response.action === 'render_parks' && response.data?.featureCollection) {
        onParkDataUpdate(response.data.featureCollection);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const renderMessageData = (data: any) => {
    if (!data) return null;

    if (data.featureCollection) {
      return (
        <Chip
          icon={<LocationOnIcon />}
          label={`${data.featureCollection.features.length} parks found`}
          variant="filled"
          size="small"
          sx={{
            mt: 1.5,
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            '& .MuiChip-icon': { color: 'white' }
          }}
        />
      );
    }

    if (data.ndvi !== undefined) {
      return (
        <Chip
          label={`NDVI: ${data.ndvi.toFixed(3)}`}
          variant="filled"
          size="small"
          sx={{
            mt: 1.5,
            bgcolor: 'rgba(76,175,80,0.9)',
            color: 'white'
          }}
        />
      );
    }

    if (data.area !== undefined) {
      return (
        <Chip
          label={`Area: ${data.area.toFixed(2)} ${data.unit}`}
          variant="filled"
          size="small"
          sx={{
            mt: 1.5,
            bgcolor: 'rgba(33,150,243,0.9)',
            color: 'white'
          }}
        />
      );
    }

    return null;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1A1B3A' }}>
      <Box sx={{ flex: 1, overflow: 'hidden', bgcolor: '#1A1B3A' }}>
        <List sx={{ height: '100%', overflow: 'auto', py: 2, px: 1 }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                flexDirection: 'column',
                alignItems: message.isUser ? 'flex-end' : 'flex-start',
                py: 1.5,
                px: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  maxWidth: '80%',
                  width: '100%',
                  flexDirection: message.isUser ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: message.isUser ? '#6366F1' : '#2563EB',
                    flexShrink: 0,
                  }}
                >
                  {message.isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                </Avatar>

                <Box
                  sx={{
                    bgcolor: message.isUser ? '#6366F1' : '#2563EB',
                    color: 'white',
                    p: 2.5,
                    borderRadius: message.isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    maxWidth: '100%',
                    boxShadow: message.isUser ? '0 4px 14px rgba(99, 102, 241, 0.25)' : '0 4px 14px rgba(37, 99, 235, 0.25)',
                    position: 'relative',
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.5, fontSize: '14px' }}>
                    {formatMessageText(message.text)}
                  </Typography>
                  {renderMessageData(message.data)}
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '11px',
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  mr: message.isUser ? 6 : 0,
                  ml: message.isUser ? 0 : 6,
                }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </ListItem>
          ))}

          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start', py: 1.5, px: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563EB' }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Box sx={{
                  bgcolor: '#2563EB',
                  color: 'white',
                  p: 2,
                  borderRadius: '20px 20px 20px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
                }}>
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                  <Typography variant="body2" sx={{ fontSize: '14px' }}>
                    Thinking...
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          )}

          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box sx={{ p: 3, bgcolor: '#1A1B3A', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {selectedParkId && (
          <Box sx={{
            mb: 2.5,
            p: 2,
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderLeft: '4px solid #6366F1'
          }}>
            <Typography variant="body2" sx={{ color: '#6366F1', fontWeight: 600, mb: 0.5 }}>
              🎯 Park Selected: {selectedParkId}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              Ask: "What's the area?", "What's the NDVI?", "What happens if removed?"
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', mr: 6 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedParkId ?
              "Ask about this park: area, NDVI, removal impact..." :
              "Ask about parks, demographics, or environmental impact..."
            }
            variant="outlined"
            size="small"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '14px',
                '&:hover': {
                  borderColor: '#6366F1',
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
                '&.Mui-focused': {
                  borderColor: '#6366F1',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                },
                '& fieldset': {
                  border: 'none',
                }
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.5)',
                  opacity: 1,
                }
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              bgcolor: '#6366F1',
              color: 'white',
              width: 44,
              height: 44,
              borderRadius: '50%',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
              '&:hover': {
                bgcolor: '#4F46E5',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
              },
              '&:disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
                boxShadow: 'none',
                transform: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;