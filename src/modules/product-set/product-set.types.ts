export type CreateProductSet = {
    title: string
    handle?: string
    metadata?: Record<string, unknown>
}

export type UpdateProductSet = {
    title?: string
    handle?: string
    metadata?: Record<string, unknown>
}