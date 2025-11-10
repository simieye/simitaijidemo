// @ts-ignore;
import React, { useState, useEffect, useRef, useCallback } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, ScrollArea, useToast } from '@/components/ui';
// @ts-ignore;
import { Send, Bot, User, Plus, MessageSquare, Trash2, Settings } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
export default function Chat(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionList, setSessionList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const messagesEndRef = useRef(null);

  // 使用useCallback避免函数重新创建导致的无限循环
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);
  useEffect(() => {
    // 避免无限循环，只在初始化时设置用户信息
    if (!isInitialized && $w.auth && $w.auth.currentUser) {
      setCurrentUser($w.auth.currentUser);
      setIsInitialized(true);
      loadSessions();
    }
  }, [$w.auth.currentUser, isInitialized]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  const loadSessions = useCallback(async () => {
    if (isLoadingSessions || !$w.auth.currentUser) return;
    setIsLoadingSessions(true);
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'chat_session',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              user_id: {
                $eq: $w.auth.currentUser.userId
              }
            }
          },
          orderBy: [{
            last_activity: 'desc'
          }],
          pageSize: 10
        }
      });
      setSessionList(result.records || []);
      if (result.records && result.records.length > 0) {
        loadSession(result.records[0].session_id);
      }
    } catch (error) {
      console.error('Load sessions error:', error);
      toast({
        title: "加载会话失败",
        description: error.message || "无法加载历史会话",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isLoadingSessions, $w.auth.currentUser, toast]);
  const loadSession = useCallback(async sessionId => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'chat_session',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              session_id: {
                $eq: sessionId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      setCurrentSession(result);
      setMessages(result.context_data?.messages || []);
    } catch (error) {
      console.error('Load session error:', error);
      toast({
        title: "加载会话失败",
        description: error.message || "无法加载会话详情",
        variant: "destructive"
      });
    }
  }, [toast]);
  const createNewSession = useCallback(async () => {
    if (!$w.auth.currentUser) {
      toast({
        title: "需要登录",
        description: "请先登录后再使用聊天功能",
        variant: "destructive"
      });
      return;
    }
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionData = {
        session_id: sessionId,
        title: '新对话',
        user_id: $w.auth.currentUser.userId,
        ai_agent_id: 'taiji_ai_v1',
        session_type: 'chat',
        status: 'active',
        message_count: 0,
        last_activity: new Date().toISOString(),
        context_data: {
          messages: []
        }
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'chat_session',
        methodName: 'wedaCreateV2',
        params: {
          data: sessionData
        }
      });
      const newSession = {
        ...sessionData,
        _id: result.id
      };
      setCurrentSession(newSession);
      setSessionList(prev => [newSession, ...prev]);
      setMessages([]);
      // 添加欢迎消息
      const welcomeMessage = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: '您好！我是SIMIAI太极AI助手。我可以基于太极哲学为您提供平衡的视角和深度洞察。请问有什么可以帮助您的吗？',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Create session error:', error);
      toast({
        title: "创建会话失败",
        description: error.message || "无法创建新的对话会话",
        variant: "destructive"
      });
    }
  }, [$w.auth.currentUser, toast]);
  const generateAIResponse = useCallback(async userInput => {
    // 基于太极哲学的AI响应逻辑
    const responses = [`从太极的角度来看，您提到的"${userInput}"体现了阴阳的相互作用。建议您在行动中保持平衡，既要有阳的进取精神，也要有阴的沉稳思考。`, `这个问题很有意思。太极哲学告诉我们，任何事物都包含对立统一的两个方面。您的情况可以从阴（内在因素）和阳（外在条件）两个维度来分析。`, `根据太极的智慧，平衡是关键。您需要在内敛与外放、稳定与变化之间找到适合自己的平衡点。建议您先静心观察，再采取行动。`, `从阴阳五行的角度分析，您的情况需要考虑相生相克的关系。建议您循序渐进，不要急于求成，让事物自然发展。`];
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);
  const updateSession = useCallback(async (updatedMessages, sessionData) => {
    if (!sessionData) return;
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'chat_session',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            message_count: updatedMessages.length,
            last_activity: new Date().toISOString(),
            last_message: updatedMessages[updatedMessages.length - 1],
            context_data: {
              messages: updatedMessages
            }
          },
          filter: {
            where: {
              _id: {
                $eq: sessionData._id
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Update session error:', error);
    }
  }, []);
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!$w.auth.currentUser) {
      toast({
        title: "需要登录",
        description: "请先登录后再使用聊天功能",
        variant: "destructive"
      });
      return;
    }
    const userMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // 立即更新UI显示用户消息
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try {
      // 如果没有当前会话，创建一个新会话
      if (!currentSession) {
        await createNewSession();
        // 重新发送消息到新创建的会话
        setTimeout(() => {
          setMessages(prev => [...prev, userMessage]);
        }, 100);
        setIsLoading(false);
        return;
      }

      // 模拟AI响应
      setTimeout(async () => {
        try {
          const aiResponse = await generateAIResponse(userMessage.content);
          const aiMessage = {
            id: `msg_${Date.now() + 1}`,
            type: 'ai',
            content: aiResponse,
            timestamp: new Date().toISOString()
          };

          // 使用函数式更新确保获取最新的消息状态
          setMessages(prev => {
            const updatedMessages = [...prev, aiMessage];
            // 异步更新会话数据，避免阻塞UI
            updateSession(updatedMessages, currentSession);
            return updatedMessages;
          });
          setIsLoading(false);
        } catch (error) {
          console.error('AI response error:', error);
          setIsLoading(false);
          toast({
            title: "AI响应失败",
            description: "无法获取AI响应，请重试",
            variant: "destructive"
          });
        }
      }, 1500);
    } catch (error) {
      console.error('Send message error:', error);
      setIsLoading(false);
      toast({
        title: "发送失败",
        description: error.message || "消息发送失败，请重试",
        variant: "destructive"
      });
    }
  }, [inputMessage, isLoading, $w.auth.currentUser, currentSession, toast, createNewSession, generateAIResponse, updateSession]);
  const deleteSession = useCallback(async sessionId => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'chat_session',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              session_id: {
                $eq: sessionId
              }
            }
          }
        }
      });
      setSessionList(prev => prev.filter(s => s.session_id !== sessionId));
      if (currentSession?.session_id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      toast({
        title: "删除成功",
        description: "对话会话已删除"
      });
    } catch (error) {
      console.error('Delete session error:', error);
      toast({
        title: "删除失败",
        description: error.message || "无法删除对话会话",
        variant: "destructive"
      });
    }
  }, [currentSession, toast]);
  const handleKeyPress = useCallback(e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);
  return <div style={style} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation $w={$w} currentPage="chat" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Session List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-white shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    对话历史
                  </CardTitle>
                  <Button onClick={createNewSession} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100%-60px)]">
                  <div className="space-y-2">
                    {sessionList.length === 0 ? <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">暂无对话历史</p>
                      </div> : sessionList.map(session => <div key={session.session_id} className={`p-3 rounded-lg cursor-pointer transition-colors group ${currentSession?.session_id === session.session_id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`} onClick={() => loadSession(session.session_id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{session.title}</h4>
                              <p className="text-xs text-gray-500">
                                {new Date(session.last_activity).toLocaleDateString()}
                              </p>
                            </div>
                            <Button onClick={e => {
                        e.stopPropagation();
                        deleteSession(session.session_id);
                      }} size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white shadow-lg flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  太极AI助手
                  {currentSession && <span className="text-sm font-normal text-gray-500">
                      - {currentSession.title}
                    </span>}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">开始新对话</h3>
                        <p className="text-gray-600 mb-4">
                          点击左侧的"+"按钮创建新的对话会话
                        </p>
                        <Button onClick={createNewSession} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Plus className="w-4 h-4 mr-2" />
                          新建对话
                        </Button>
                      </div> : messages.map(message => <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.type === 'ai' && <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>}
                          
                          <div className={`max-w-[70%] p-3 rounded-lg ${message.type === 'user' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {message.type === 'user' && <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>}
                        </div>)}
                    
                    {isLoading && <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                          animationDelay: '0.1s'
                        }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                          animationDelay: '0.2s'
                        }}></div>
                          </div>
                        </div>
                      </div>}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                {currentSession && <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="输入您的问题..." disabled={isLoading} className="flex-1" />
                      <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}