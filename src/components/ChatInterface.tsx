import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  useTheme,
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
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

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
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
        />
      );
    }

    if (data.ndvi !== undefined) {
      return (
        <Chip
          label={`NDVI: ${data.ndvi.toFixed(3)}`}
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          color="success"
        />
      );
    }

    if (data.area !== undefined) {
      return (
        <Chip
          label={`Area: ${data.area.toFixed(2)} ${data.unit}`}
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          color="info"
        />
      );
    }

    return null;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderBottom: '1px solid #E0E0E0'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32' }}>
          Chat Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ask me about parks and urban planning
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <List sx={{ height: '100%', overflow: 'auto', py: 1 }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                flexDirection: 'column',
                alignItems: message.isUser ? 'flex-end' : 'flex-start',
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '85%',
                  flexDirection: message.isUser ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: message.isUser ? theme.palette.secondary.main : theme.palette.primary.main,
                  }}
                >
                  {message.isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                </Avatar>

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '100%',
                    bgcolor: message.isUser
                      ? theme.palette.secondary.light
                      : theme.palette.grey[100],
                    color: message.isUser ? 'white' : 'text.primary',
                    borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
                    {formatMessageText(message.text)}
                  </Typography>
                  {renderMessageData(message.data)}
                </Paper>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  mr: message.isUser ? 5 : 0,
                  ml: message.isUser ? 0 : 5,
                }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </ListItem>
          ))}

          {isLoading && (
            <ListItem sx={{ justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </ListItem>
          )}

          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        {selectedParkId && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: 'success.light', borderRadius: 2, border: '1px solid', borderColor: 'success.main' }}>
            <Typography variant="body2" sx={{ color: 'success.contrastText', fontWeight: 500 }}>
              🎯 Park Selected: {selectedParkId}
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.contrastText', opacity: 0.9 }}>
              You can now ask: "What's the area?", "What's the NDVI?", "What happens if removed?"
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
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
                borderRadius: 3,
                bgcolor: 'background.paper',
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            color="primary"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              }
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