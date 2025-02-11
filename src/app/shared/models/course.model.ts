export interface Course {
  id: number
  uuid: string
  name: string
  start_at: Date
  end_at: Date
  owner_id: number
  canvasCourseId: number
  //assignments: Assignment[]
}

