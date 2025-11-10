// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea, Avatar, AvatarFallback, AvatarImage, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Mail, Phone, Calendar, MapPin, Globe, Settings, History, Award, TrendingUp, Star, LogOut, Edit2, Save, X } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
export default function Profile(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  useEffect(() => {
    if ($w.auth.currentUser) {
      setCurrentUser($w.auth.currentUser);
      loadUserProfile();
      loadAnalysisHistory();
    }
  }, [$w.auth.currentUser]);
  const loadUserProfile = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_profile',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              username: {
                $eq: $w.auth.currentUser.userId
              }
            }
          },
          limit: 1
        }
      });
      if (result.records && result.records.length > 0) {
        setUserProfile(result.records[0]);
        setEditForm(result.records[0]);
      } else {
        // 创建用户档案
        await createUserProfile();
      }
    } catch (error) {
      console.error('Load profile error:', error);
    }
  };
  const createUserProfile = async () => {
    try {
      const profileData = {
        username: $w.auth.currentUser.userId,
        nickname: $w.auth.currentUser.nickName || $w.auth.currentUser.name,
        email: $w.auth.currentUser.userId + '@simiai.com',
        is_active: true,
        last_login: new Date().toISOString(),
        login_count: 1,
        language: 'zh',
        timezone: 'Asia/Shanghai',
        theme: 'light',
        user_level: 1,
        experience_points: 0,
        reputation_score: 100,
        email_verified: false,
        phone_verified: false
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_profile',
        methodName: 'wedaCreateV2',
        params: {
          data: profileData
        }
      });
      const newProfile = {
        ...profileData,
        _id: result.id
      };
      setUserProfile(newProfile);
      setEditForm(newProfile);
    } catch (error) {
      console.error('Create profile error:', error);
    }
  };
  const loadAnalysisHistory = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'ai_analysis_result',
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
            createdAt: 'desc'
          }],
          pageSize: 10
        }
      });
      setAnalysisHistory(result.records || []);
    } catch (error) {
      console.error('Load analysis history error:', error);
    }
  };
  const handleSaveProfile = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'user_profile',
        methodName: 'wedaUpdateV2',
        params: {
          data: editForm,
          filter: {
            where: {
              _id: {
                $eq: userProfile._id
              }
            }
          }
        }
      });
      setUserProfile(editForm);
      setIsEditing(false);
      toast({
        title: "保存成功",
        description: "个人资料已更新"
      });
    } catch (error) {
      console.error('Save profile error:', error);
      toast({
        title: "保存失败",
        description: error.message || "无法保存个人资料",
        variant: "destructive"
      });
    }
  };
  const handleCancelEdit = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };
  const handleLogout = () => {
    // 这里应该调用登出逻辑
    toast({
      title: "已退出登录",
      description: "您已成功退出登录"
    });
    $w.utils.navigateTo({
      pageId: 'home',
      params: {}
    });
  };
  if (!currentUser) {
    return <div style={style} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navigation $w={$w} currentPage="profile" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Card className="bg-white shadow-lg">
                <CardContent className="text-center py-12">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h2>
                  <p className="text-gray-600 mb-6">登录后即可查看和管理个人资料</p>
                  <Button onClick={() => $w.utils.navigateTo({
              pageId: 'home',
              params: {}
            })} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    返回首页
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>;
  }
  return <div style={style} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navigation $w={$w} currentPage="profile" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl">
                      {userProfile?.nickname?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userProfile?.nickname || currentUser?.name || '用户'}
                    </h1>
                    <p className="text-gray-600">
                      {userProfile?.bio || '探索太极智慧的AI爱好者'}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          等级 {userProfile?.user_level || 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">
                          {userProfile?.experience_points || 0} 经验值
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">
                          {userProfile?.reputation_score || 100} 声誉
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      编辑资料
                    </Button> : <>
                      <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        保存
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        取消
                      </Button>
                    </>}
                  <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    退出
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">个人资料</TabsTrigger>
                <TabsTrigger value="history">分析历史</TabsTrigger>
                <TabsTrigger value="settings">设置</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        基本信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="nickname">昵称</Label>
                        <Input id="nickname" value={editForm.nickname || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    nickname: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                      
                      <div>
                        <Label htmlFor="real-name">真实姓名</Label>
                        <Input id="real-name" value={editForm.real_name || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    real_name: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">个人简介</Label>
                        <Textarea id="bio" value={editForm.bio || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))} disabled={!isEditing} rows={3} />
                      </div>
                      
                      <div>
                        <Label htmlFor="location">所在地</Label>
                        <Input id="location" value={editForm.location || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    location: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        联系信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email">邮箱地址</Label>
                        <Input id="email" type="email" value={editForm.email || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    email: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">手机号码</Label>
                        <Input id="phone" value={editForm.phone || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                      
                      <div>
                        <Label htmlFor="website">个人网站</Label>
                        <Input id="website" value={editForm.website || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    website: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                      
                      <div>
                        <Label htmlFor="birthday">生日</Label>
                        <Input id="birthday" type="date" value={editForm.birthday || ''} onChange={e => setEditForm(prev => ({
                    ...prev,
                    birthday: e.target.value
                  }))} disabled={!isEditing} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      分析历史
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisHistory.length === 0 ? <div className="text-center py-12">
                        <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无分析记录</h3>
                        <p className="text-gray-600 mb-4">
                          开始使用AI分析功能后，您的分析记录将显示在这里
                        </p>
                        <Button onClick={() => $w.utils.navigateTo({
                  pageId: 'demo',
                  params: {}
                })} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          开始分析
                        </Button>
                      </div> : <div className="space-y-4">
                        {analysisHistory.map(analysis => <div key={analysis._id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {analysis.analysis_type || '决策分析'}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(analysis.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2 line-clamp-2">
                              {analysis.input_text || '无文本输入'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-blue-600">
                                平衡分数: {analysis.balance_score || 0}
                              </span>
                              <span className="text-green-600">
                                置信度: {analysis.confidence_level || 0}%
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${analysis.analysis_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {analysis.analysis_status === 'completed' ? '已完成' : '处理中'}
                              </span>
                            </div>
                          </div>)}
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        偏好设置
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="language">语言偏好</Label>
                        <select id="language" value={editForm.language || 'zh'} onChange={e => setEditForm(prev => ({
                    ...prev,
                    language: e.target.value
                  }))} disabled={!isEditing} className="w-full p-2 border rounded-md">
                          <option value="zh">中文</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="timezone">时区</Label>
                        <select id="timezone" value={editForm.timezone || 'Asia/Shanghai'} onChange={e => setEditForm(prev => ({
                    ...prev,
                    timezone: e.target.value
                  }))} disabled={!isEditing} className="w-full p-2 border rounded-md">
                          <option value="Asia/Shanghai">Asia/Shanghai</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="theme">主题偏好</Label>
                        <select id="theme" value={editForm.theme || 'light'} onChange={e => setEditForm(prev => ({
                    ...prev,
                    theme: e.target.value
                  }))} disabled={!isEditing} className="w-full p-2 border rounded-md">
                          <option value="light">浅色主题</option>
                          <option value="dark">深色主题</option>
                          <option value="auto">跟随系统</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle>账户统计</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {userProfile?.login_count || 0}
                          </div>
                          <div className="text-sm text-gray-600">登录次数</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {analysisHistory.length}
                          </div>
                          <div className="text-sm text-gray-600">分析次数</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {userProfile?.experience_points || 0}
                        </div>
                        <div className="text-sm text-gray-600">总经验值</div>
                      </div>
                      
                      <div className="text-sm text-gray-500 text-center">
                        最后登录: {userProfile?.last_login ? new Date(userProfile.last_login).toLocaleString() : '首次登录'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>;
}