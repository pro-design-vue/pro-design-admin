<!--
 * @Author: shen
 * @Date: 2025-05-28 13:45:47
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 17:32:24
 * @Description:
-->
<script setup lang="ts">
import type { AnalysisOverviewItem } from './components/analysis-overview.vue'

import { ref } from 'vue'
import { Card, Row, Col } from 'ant-design-vue'
import { ProPage } from 'pro-design-vue'
import { SvgBellerIcon, SvgCakeIcon, SvgCardIcon, SvgDownloadIcon } from '@/icons'

import AnalyticsTrends from './components/analytics-trends.vue'
import AnalysisOverview from './components/analysis-overview.vue'
import AnalyticsVisits from './components/analytics-visits.vue'
import AnalyticsVisitsData from './components/analytics-visits-data.vue'
import AnalyticsVisitsSales from './components/analytics-visits-sales.vue'
import AnalyticsVisitsSource from './components/analytics-visits-source.vue'

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '用户量',
    totalTitle: '总用户量',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '访问量',
    totalTitle: '总访问量',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '下载量',
    totalTitle: '总下载量',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellerIcon,
    title: '使用量',
    totalTitle: '总使用量',
    totalValue: 50_000,
    value: 5000,
  },
]

const tabKey = ref('trends')
const chartTabs = [
  {
    tab: '流量趋势',
    key: 'trends',
  },
  {
    tab: '月访问量',
    key: 'visits',
  },
]
</script>

<template>
  <ProPage>
    <AnalysisOverview :items="overviewItems" />
    <Card
      :activeTabKey="tabKey"
      :tab-list="chartTabs"
      style="margin-top: 16px"
      @tabChange="(key) => (tabKey = key)"
    >
      <AnalyticsTrends v-if="tabKey === 'trends'" />
      <AnalyticsVisits v-else />
    </Card>

    <Row :gutter="[16, 16]" style="margin-top: 16px">
      <Col :xs="24" :lg="8">
        <Card title="访问数量">
          <AnalyticsVisitsData />
        </Card>
      </Col>
      <Col :xs="24" :lg="8">
        <Card title="访问来源">
          <AnalyticsVisitsSource />
        </Card>
      </Col>
      <Col :xs="24" :lg="8">
        <Card title="销售方向">
          <AnalyticsVisitsSales />
        </Card>
      </Col>
    </Row>
  </ProPage>
</template>
