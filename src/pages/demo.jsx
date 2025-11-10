// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';
// @ts-ignore;
import { Upload, FileText, Image, BarChart3, Download, Share2, RefreshCw, Sparkles } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
import { TaijiChart } from '@/components/TaijiChart';
export default function Demo(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [inputText, setInputText] = useState('');
  const [analysisType, setAnalysisType] = useState('decision');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    // 避免无限循环，只在初始化时设置用户信息
    if (!isInitialized && $w.auth && $w.auth.currentUser) {
      setCurrentUser($w.auth.currentUser);
      setIsInitialized(true);
    }
  }, [$w.auth.currentUser, isInitialized]);
  const handleFileUpload = event => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "文件上传成功",
      description: `已上传 ${files.length} 个文件`
    });
  };
  const handleAnalyze = async () => {
    if (!inputText.trim() && uploadedFiles.length === 0) {
      toast({
        title: "输入错误",
        description: "请输入文本或上传文件进行分析",
        variant: "destructive"
      });
      return;
    }
    if (!$w.auth.currentUser) {
      toast({
        title: "需要登录",
        description: "请先登录后再使用AI分析功能",
        variant: "destructive"
      });
      $w.utils.navigateTo({
        pageId: 'profile',
        params: {}
      });
      return;
    }
    setIsAnalyzing(true);
    try {
      // 创建分析记录
      const analysisData = {
        user_id: $w.auth.currentUser.userId,
        analysis_type: analysisType,
        input_text: inputText,
        input_files: uploadedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        analysis_status: 'processing',
        model_version: '1.0.0'
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'ai_analysis_result',
        methodName: 'wedaCreateV2',
        params: {
          data: analysisData
        }
      });
      const analysisId = result.id;
      // 模拟AI分析过程
      setTimeout(async () => {
        const mockAnalysisResult = {
          yin_analysis: {
            percentage: Math.floor(Math.random() * 30) + 35,
            description: '内敛、稳定、深思熟虑',
            factors: ['风险因素', '潜在挑战', '内部约束']
          },
          yang_analysis: {
            percentage: Math.floor(Math.random() * 30) + 35,
            description: '外放、活跃、充满机遇',
            factors: ['发展机会', '优势资源', '外部支持']
          },
          balance_score: Math.floor(Math.random() * 20) + 75,
          harmony_index: Math.floor(Math.random() * 15) + 80,
          confidence_level: Math.floor(Math.random() * 10) + 85,
          recommendations: ['保持阴阳平衡的发展策略', '注重内在修养与外在表现的协调', '在稳定中寻求创新突破'],
          analysis_result: {
            summary: '基于太极哲学的深度分析显示，当前状况处于相对平衡状态，建议继续保持稳定发展。',
            key_insights: ['内在潜力与外部机遇相匹配', '风险可控，发展前景良好', '需要关注长期平衡发展']
          },
          visualization_data: {
            chart_type: 'taiji',
            data_points: generateVisualizationData()
          },
          processing_time: Math.floor(Math.random() * 2000) + 1000
        };
        // 更新分析结果
        await $w.cloud.callDataSource({
          dataSourceName: 'ai_analysis_result',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              ...mockAnalysisResult,
              analysis_status: 'completed',
              yin_analysis: mockAnalysisResult.yin_analysis,
              yang_analysis: mockAnalysisResult.yang_analysis,
              balance_score: mockAnalysisResult.balance_score,
              harmony_index: mockAnalysisResult.harmony_index,
              confidence_level: mockAnalysisResult.confidence_level,
              analysis_result: mockAnalysisResult.analysis_result,
              recommendations: mockAnalysisResult.recommendations,
              visualization_data: mockAnalysisResult.visualization_data,
              processing_time: mockAnalysisResult.processing_time
            },
            filter: {
              where: {
                _id: {
                  $eq: analysisId
                }
              }
            }
          }
        });
        setAnalysisResult(mockAnalysisResult);
        setIsAnalyzing(false);
        toast({
          title: "分析完成",
          description: "AI分析已完成，请查看结果"
        });
      }, 2000);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      toast({
        title: "分析失败",
        description: error.message || "分析过程中出现错误，请重试",
        variant: "destructive"
      });
    }
  };
  const generateVisualizationData = () => {
    return Array.from({
      length: 12
    }, (_, i) => ({
      month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'][i],
      yin: Math.floor(Math.random() * 50) + 25,
      yang: Math.floor(Math.random() * 50) + 25
    }));
  };
  const handleExport = () => {
    if (!analysisResult) return;
    const exportData = {
      timestamp: new Date().toISOString(),
      input: {
        text: inputText,
        files: uploadedFiles.map(f => f.name)
      },
      result: analysisResult
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taiji-analysis-${Date.now()}.json`;
    a.click();
    toast({
      title: "导出成功",
      description: "分析结果已导出为JSON文件"
    });
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SIMIAI太极AI分析结果',
        text: `平衡分数: ${analysisResult?.balance_score}分`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "链接已复制",
        description: "分析链接已复制到剪贴板"
      });
    }
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation $w={$w} currentPage="demo" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI太极分析演示</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            输入您的问题或上传相关文件，我们的AI将基于太极哲学为您提供深度分析和平衡建议
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  输入信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="analysis-type">分析类型</Label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分析类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decision">决策分析</SelectItem>
                      <SelectItem value="balance">平衡评估</SelectItem>
                      <SelectItem value="insight">洞察分析</SelectItem>
                      <SelectItem value="strategy">战略规划</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="input-text">问题描述</Label>
                  <Textarea id="input-text" placeholder="请详细描述您希望分析的问题或情况..." value={inputText} onChange={e => setInputText(e.target.value)} className="min-h-32" />
                </div>

                <div>
                  <Label htmlFor="file-upload">文件上传（可选）</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input id="file-upload" type="file" multiple onChange={handleFileUpload} className="hidden" accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">点击上传文件或拖拽到此处</p>
                      <p className="text-sm text-gray-400 mt-2">支持 TXT, PDF, DOC, JPG, PNG 格式</p>
                    </label>
                  </div>
                </div>

                {uploadedFiles.length > 0 && <div className="space-y-2">
                    <Label>已上传文件</Label>
                    {uploadedFiles.map((file, index) => <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm flex-1">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)}KB</span>
                      </div>)}
                  </div>}

                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  {isAnalyzing ? <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      分析中...
                    </> : <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      开始分析
                    </>}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult ? <>
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        分析结果
                      </span>
                      <div className="flex gap-2">
                        <Button onClick={handleExport} size="sm" variant="outline" className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          导出
                        </Button>
                        <Button onClick={handleShare} size="sm" variant="outline" className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          分享
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaijiChart yinData={analysisResult.yin_analysis} yangData={analysisResult.yang_analysis} balanceScore={analysisResult.balance_score} />
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>详细分析</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">综合评估</h4>
                      <p className="text-gray-600">{analysisResult.analysis_result.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">关键洞察</h4>
                      <ul className="space-y-1">
                        {analysisResult.analysis_result.key_insights.map((insight, index) => <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span className="text-gray-600">{insight}</span>
                          </li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">建议措施</h4>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec, index) => <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <span className="text-gray-600">{rec}</span>
                          </li>)}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysisResult.harmony_index}</div>
                        <div className="text-sm text-gray-500">和谐指数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysisResult.confidence_level}%</div>
                        <div className="text-sm text-gray-500">置信度</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </> : <Card className="bg-white shadow-lg">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">等待分析</h3>
                  <p className="text-gray-600">
                    输入您的问题并点击"开始分析"，AI将为您提供太极哲学视角的深度分析
                  </p>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>
    </div>;
}