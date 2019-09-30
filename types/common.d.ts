import hapi from 'hapi'

type tSemester = '1학기' | '하기계절' | '2학기' | '동기계절'
type tSemester_num = 10 | 11 | 20 | 21
type tRow_count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type tStatus = '재학' | '휴힉'
type tYear = number
type tBoolInt = 0 | 1

type tUnivs =
  | '인문대학'
  | '사회과학대학'
  | '경상대학'
  | '사범대학'
  | '생명자원대학'
  | '해양과학대학'
  | '자연과학대학'
  | '공과대학'
  | '의과대학'
  | '교육대학'
  | '수의과대학'
  | '간호대학'
  | '예술대자인대학'
  | '미래융합대학'

interface commonProps {
  student_no: number
}

export interface doSearchProps extends commonProps {
  mode: 'doSearch'
}

export interface doListProps extends commonProps {
  mode: 'doList'
  year: tYear
  term_gb: tSemester_num
  group_gb: 20
  outside_seq: 0 | 1
  del_gb: 'AND SJ_DEL_GB IS NULL'
}

export type SearchOrList = doListProps | doSearchProps

export interface Req extends hapi.Request {
  payload: SearchOrList
}
