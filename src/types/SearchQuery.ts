export type SearchQuery = {
    /** The search query */
    q: string,
    /** field to search, undefined for any 
     * @default "title"
    */
    field?: "title" | "authors" | "series" | undefined,
    /**
     * @default undefined
     */
    language?: "English" | string,
    /** format to search for, undefined for any 
     * @default undefined
     */
    format?: "epub" | "mobi" | string,
    /** whether to support wildcards in the search query
     * @default undefined
     */
    wildcard?: boolean
  }
  