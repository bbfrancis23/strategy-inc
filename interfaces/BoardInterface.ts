import {Column} from './Column'
import {Scope} from './Scope'

export interface Board {
  id: string
  title: string
  scope?: Scope
  columns: Column[]
  directoryId?: string
}

// QA: Brian Francis 8-10-23
