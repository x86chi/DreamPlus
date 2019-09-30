import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { white, mainBoxShadow } from '../styles/colors'
import { DonutChart, PieChart, LineChart } from './Charts'
import { Regular } from './Text'
import { Skeleton } from './Skleton'

import { FetchPoint } from '../api'

import { doListProps } from '../../types/common.d'
import { grade_item, grade } from '../../types/json.d'

import countBy from 'ramda/src/countBy'
import flatten from 'ramda/src/flatten'
// HACK: countBy can't use rambda/src/identify for grade_item[] type
import toUpper from 'ramda/src/toUpper'

type NumberType = number | null
type NumberTypes = number[] | null
type GradeCountType = PieProps[] | null

interface gradeCountKV {
  [key: string]: string
}

interface PieProps {
  title: grade_item
  value: number
  color: string
}

const PiePalette: gradeCountKV = {
  'A+': '#D7A2D4',
  A0: '#F08676',
  A: '#F08676',
  'A-': '#D6A663',
  'B+': '#7BA0DC',
  B0: '#6D7B95',
  'B-': '#9C84D8',
  'C+': '#A3C56B',
  C0: '#86D0C2',
  'C-': '#EBC469',
  'D+': '#000000',
  D0: '#000000',
  'D-': '#000000',
  F: '#000000',
  S: '#000000',
}

const FlexBox = styled.div`
  display: flex;
`

const RootBox = styled(FlexBox)`
  box-shadow: 0 19px 32px ––0 ${mainBoxShadow};
  background-color: ${white};
  border-radius: 16px;
  margin-top: 22px;
  maring-bottom: 114px;
  min-height: 768px;
  flex-direction: column;
  padding-top: 28px;
  padding-left: 10%;
  padding-right: 10%;
`

const CircleChartWrap = styled(FlexBox)`
  justify-content: space-around;
  margin-bottom: 92px;
`

const SkletonCircle = styled(Skeleton)`
  width: 170px;
  height: 170px;
  border-radius: 50%;
`

const SkletonLineChart = styled(Skeleton)`
  width: 100%;
  height: 150px;
  border-radius: 5px;
`

const JustifySelf = styled.div`
  justify-self: center;
`

const Main = () => {
  const [totalAverage, setTotalAvarage] = useState<NumberType>(null)
  const [creadit, setCreadit] = useState<NumberType>(null)
  const [gradesCount, setGradeCount] = useState<GradeCountType>(null)
  const [eachAverage, setEachAverage] = useState<NumberTypes>(null)

  useEffect(() => {
    const fetchData = async () => {
      const {
        TOP_DATA: { avg_mark, apply_credit },
        TERMNOW_DATA,
      } = await FetchPoint({
        mode: 'doSearch',
        student_no: 2018103277,
      })

      setTotalAvarage(avg_mark)
      setCreadit(apply_credit)

      if (!TERMNOW_DATA) return

      setEachAverage(
        TERMNOW_DATA.filter(i => i.avg_mark !== 0).map(i => i.avg_mark)
      )

      const ListProp = TERMNOW_DATA.map<doListProps>(i => ({
        mode: 'doList',
        year: i.year,
        term_gb: i.term_gb,
        group_gb: 20,
        student_no: 20181023277,
        outside_seq: i.outside_seq,
        del_gb: 'AND SJ_DEL_GB IS NULL',
      }))
      const fetched = await Promise.all(ListProp.map(i => FetchPoint(i)))

      const counted = countBy(toUpper)(
        flatten(
          fetched.map(i =>
            i.GRID_DATA!.filter((g: grade) => g.dg_gb !== 'S').map(g => g.dg_gb)
          )
        )
      )

      setGradeCount(
        Object.entries(counted).map(([k, v]) => ({
          title: k as grade_item,
          value: v,
          color: PiePalette[k],
        }))
      )
    }
    fetchData()
  }, [])

  const series = [
    {
      name: '김무훈',
      data: eachAverage,
    },
  ]
  return (
    <RootBox>
      <CircleChartWrap>
        {!totalAverage && <SkletonCircle />}
        {totalAverage && (
          <DonutChart title={'평점'} value={totalAverage} totalValue={4.3} />
        )}
        {!creadit && <SkletonCircle />}
        {creadit && (
          <DonutChart title={'취득학점'} value={creadit} totalValue={130} />
        )}

        {!gradesCount && <SkletonCircle />}
        {gradesCount && <PieChart data={gradesCount} />}
      </CircleChartWrap>
      <JustifySelf>
        <Regular>학기별 학점 현황</Regular>
        {!eachAverage && <SkletonLineChart />}
        {eachAverage && <LineChart series={series} />}
      </JustifySelf>
    </RootBox>
  )
}

export default Main
