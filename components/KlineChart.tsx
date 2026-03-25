import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Kline } from '../constants/types';

interface KlineChartProps {
  data: Kline[];
  symbol: string;
  isDark: boolean;
}

function generateKlineHtml(data: Kline[], symbol: string, isDark: boolean): string {
  const dates = data.map((d) => {
    const date = new Date(d.time);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  const ohlc = data.map((d) => [d.open, d.close, d.low, d.high]);
  const upColor = '#e74c3c';
  const downColor = '#27ae60';
  const volumes = data.map((d) => ({
    value: d.volume,
    itemStyle: {
      color: d.close >= d.open ? upColor + '99' : downColor + '99',
    },
  }));

  const textColor = isDark ? '#8891a5' : '#6b7280';
  const gridColor = isDark ? '#2a3344' : '#e8e5df';
  const bgColor = isDark ? '#1a2030' : '#ffffff';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: ${bgColor}; }
    #chart { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="chart"></div>
  <script>
    var chart = echarts.init(document.getElementById('chart'));
    var option = {
      backgroundColor: 'transparent',
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: { color: '${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}', width: 0.5 },
          lineStyle: { color: '${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}', width: 0.5, type: 'dashed' },
          label: { backgroundColor: '${isDark ? '#1a2030' : '#1f2937'}', color: '#f3f4f6', fontSize: 10, padding: [4, 6] }
        },
        confine: true,
        backgroundColor: '${isDark ? 'rgba(22,27,38,0.95)' : 'rgba(255,255,255,0.95)'}',
        borderColor: '${gridColor}',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '${isDark ? '#edf0f5' : '#1f2937'}', fontSize: 11 }
      },
      grid: [
        { left: 48, right: 12, top: 12, height: '55%' },
        { left: 48, right: 12, top: '72%', height: '18%' }
      ],
      xAxis: [
        {
          type: 'category', data: ${JSON.stringify(dates)}, boundaryGap: true,
          axisLine: { lineStyle: { color: '${gridColor}' } },
          axisLabel: { color: '${textColor}', fontSize: 10, margin: 8 },
          splitLine: { show: false }, min: 'dataMin', max: 'dataMax'
        },
        {
          type: 'category', gridIndex: 1, data: ${JSON.stringify(dates)}, boundaryGap: true,
          axisLine: { lineStyle: { color: '${gridColor}' } },
          axisLabel: { show: false }, axisTick: { show: false }, splitLine: { show: false },
          min: 'dataMin', max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true, splitArea: { show: false },
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: '${textColor}', fontSize: 10, margin: 4 },
          splitLine: { lineStyle: { color: '${gridColor}', type: 'dashed', opacity: 0.5 } }
        },
        {
          scale: true, gridIndex: 1, splitNumber: 2,
          axisLabel: { show: false }, axisLine: { show: false },
          axisTick: { show: false }, splitLine: { show: false }
        }
      ],
      dataZoom: [{
        type: 'inside', xAxisIndex: [0, 1], start: 60, end: 100,
        zoomOnMouseWheel: true, moveOnMouseMove: true, minSpan: 10, maxSpan: 100
      }],
      series: [
        {
          name: '${symbol}', type: 'candlestick', data: ${JSON.stringify(ohlc)},
          itemStyle: {
            color: '${upColor}', color0: '${downColor}',
            borderColor: '${upColor}', borderColor0: '${downColor}'
          },
          barMaxWidth: 12, barMinWidth: 2
        },
        {
          name: 'Volume', type: 'bar', xAxisIndex: 1, yAxisIndex: 1,
          data: ${JSON.stringify(volumes)}, barMaxWidth: 12, barMinWidth: 2
        }
      ]
    };
    chart.setOption(option);
    window.addEventListener('resize', function() { chart.resize(); });
  </script>
</body>
</html>`;
}

export default function KlineChart({ data, symbol, isDark }: KlineChartProps) {
  const html = generateKlineHtml(data, symbol, isDark);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          srcDoc={html}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        startInLoadingState={false}
        overScrollMode="never"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
