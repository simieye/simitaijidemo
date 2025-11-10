// @ts-ignore;
import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { Play, ArrowRight, Sparkles, Brain, Balance, Users, BarChart3, MessageSquare } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
import { TaijiChart } from '@/components/TaijiChart';
export default function Home(props) {
  const {
    $w,
    style
  } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 使用useCallback避免函数重新创建导致的无限循环
  const handleStartDemo = useCallback(() => {
    $w.utils.navigateTo({
      pageId: 'demo',
      params: {}
    });
  }, [$w.utils]);
  const handleStartChat = useCallback(() => {
    $w.utils.navigateTo({
      pageId: 'chat',
      params: {}
    });
  }, [$w.utils]);
  const handleMouseEnter = useCallback(() => {
    setIsAnimating(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsAnimating(false);
  }, []);
  useEffect(() => {
    // 避免无限循环，只在初始化时设置用户信息
    if (!isInitialized && $w.auth && $w.auth.currentUser) {
      setCurrentUser($w.auth.currentUser);
      setIsInitialized(true);
    }
  }, [$w.auth.currentUser, isInitialized]);
  const features = [{
    icon: <Brain className="w-8 h-8" />,
    title: '智能分析',
    description: '基于深度学习的太极哲学AI分析引擎',
    color: 'from-blue-600 to-purple-600'
  }, {
    icon: <Balance className="w-8 h-8" />,
    title: '阴阳平衡',
    description: '独特的阴阳二元分析框架，洞察事物本质',
    color: 'from-gray-700 to-gray-900'
  }, {
    icon: <BarChart3 className="w-8 h-8" />,
    title: '可视化展示',
    description: '直观的太极图表和数据可视化',
    color: 'from-green-600 to-teal-600'
  }, {
    icon: <MessageSquare className="w-8 h-8" />,
    title: '实时对话',
    description: '与AI助手进行深度交流和探讨',
    color: 'from-orange-600 to-red-600'
  }];
  return <div style={style} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation $w={$w} currentPage="home" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className={`w-32 h-32 mx-auto bg-gradient-to-br from-white to-black rounded-full flex items-center justify-center ${isAnimating ? 'animate-spin' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="w-24 h-24 bg-gradient-to-br from-black to-white rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              SIMIAI 太极AI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              融合东方智慧与人工智能，通过阴阳平衡的哲学视角，为您提供独特的决策分析和洞察
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleStartDemo} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2">
                <Play className="w-5 h-5" />
                开始体验
              </Button>
              <Button onClick={handleStartChat} size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                智能对话
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-black opacity-20 rounded-full animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              结合传统太极哲学与现代AI技术，为您提供全方位的智能分析服务
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">实时太极分析</h2>
              <p className="text-lg text-gray-700 mb-8">
                我们的AI引擎能够实时分析您输入的数据，通过阴阳二元框架提供平衡的视角和深度洞察。
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">智能识别阴阳元素</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">实时计算平衡指数</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">生成可视化报告</span>
                </div>
              </div>
              <Button onClick={handleStartDemo} className="mt-8 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-6 py-3 flex items-center gap-2">
                立即试用
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <TaijiChart yinData={{
              percentage: 45,
              description: '内敛、稳定、深沉'
            }} yangData={{
              percentage: 55,
              description: '外放、活跃、明亮'
            }} balanceScore={85} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl font-bold mb-6">准备好体验太极AI的智慧了吗？</h2>
          <p className="text-xl mb-8 text-gray-300">
            加入我们，探索AI与东方哲学的完美融合
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleStartDemo} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold">
              免费开始
            </Button>
            <Button onClick={() => $w.utils.navigateTo({
            pageId: 'profile',
            params: {}
          })} size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold">
              了解更多
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-white to-black rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-black to-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="ml-2 text-lg font-bold">SIMIAI太极AI</span>
              </div>
              <p className="text-gray-400">融合东方智慧与人工智能</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handleStartDemo} className="hover:text-white">AI演示</button></li>
                <li><button onClick={handleStartChat} className="hover:text-white">智能对话</button></li>
                <li><button className="hover:text-white">API文档</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">公司</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">关于我们</button></li>
                <li><button className="hover:text-white">联系我们</button></li>
                <li><button className="hover:text-white">加入我们</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">帮助中心</button></li>
                <li><button className="hover:text-white">隐私政策</button></li>
                <li><button className="hover:text-white">服务条款</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SIMIAI太极AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
}