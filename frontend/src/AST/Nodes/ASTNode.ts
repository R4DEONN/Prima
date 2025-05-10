export abstract class ASTNode
{
    protected constructor(
        public nodeType: string
    )
    {
    }

    public generate(): string
    {
        return this.nodeType;
    }

}