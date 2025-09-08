<!--
 * @Author: shen
 * @Date: 2025-05-28 13:45:47
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:52:47
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'
import { Card, Row, Col } from 'ant-design-vue'
import { ProIcon } from '@/components/common'
import { ProCounter } from 'pro-design-vue'

export interface AnalysisOverviewItem {
  icon: Component | string
  title: string
  totalTitle: string
  totalValue: number
  value: number
}

interface Props {
  items?: AnalysisOverviewItem[]
}

withDefaults(defineProps<Props>(), {
  items: () => [],
})
</script>

<template>
  <Row :gutter="[16, 16]">
    <Col v-for="item in items" :key="item.title" :xs="24" :md="12" :xl="6">
      <Card :title="item.title">
        <div class="analysis-overview-item">
          <div class="analysis-overview-item-box">
            <ProCounter
              :end-val="item.value"
              :start-val="1"
              class="analysis-overview-item-count"
              prefix=""
            />
            <ProIcon :icon="item.icon" class="analysis-overview-item-icon" />
          </div>
          <div class="analysis-overview-item-box" style="margin-top: 20px">
            <span>{{ item.totalTitle }}</span>
            <ProCounter :end-val="item.totalValue" :start-val="1" prefix="" />
          </div>
        </div>
      </Card>
    </Col>
  </Row>
</template>

<style lang="less" scoped>
.analysis-overview {
  &-item {
    &-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-count {
      font-size: 20px;
      line-height: 28px;
    }

    &-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
    }
  }
}
</style>
