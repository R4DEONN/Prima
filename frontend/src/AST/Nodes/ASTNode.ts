export abstract class ASTNode
{
    protected constructor(
        public nodeType: string
    )
    {
    }

    abstract generate(): string

}