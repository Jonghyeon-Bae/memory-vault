export interface Memory {
    id: string
    title: string
    content: string
    imageUrl: string
    createdAt: string
}

export interface SharedLink {
    id: string
    memoryId: string
    oneTimePassword: string
    isUsed: boolean
    createdAt: string
}
