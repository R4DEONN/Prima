import {GrammarRow} from '../Data/Grammar';

const FULL_RULE_REGEX_STR = String.raw`\s*(<[^>]+>)\s*->\s*([^|]+?)\s*\|\s*([^\s]+(?:\s+[^\s]+)*)\s*`;
const RIGHT_PART_OF_RULE_REGEX_STR = String.raw`(<[^>]+>|~[^~]+~)`;
const GUIDE_SYMBOLS_REGEX_STR = String.raw`([^\s]+)`;

export class GrammarParser
{
    private static removeExtraBlanks(str: string): string
    {
        return str.trim();
    }

    private static parseRightParts(result: GrammarRow, rightPartStr: string): void
    {
        const rightPattern = new RegExp(RIGHT_PART_OF_RULE_REGEX_STR, 'g');
        let match;
        while ((match = rightPattern.exec(rightPartStr)) !== null)
        {
            const token = this.removeExtraBlanks(match[0]);
            if (token)
            {
                result.rightParts.push(token);
            }
        }
    }

    private static parseGuideSymbols(result: GrammarRow, guidesStr: string): void
    {
        const guidePattern = new RegExp(GUIDE_SYMBOLS_REGEX_STR, 'g');
        let match;
        while ((match = guidePattern.exec(guidesStr)) !== null)
        {
            const symbol = this.removeExtraBlanks(match[1]);
            if (symbol)
            {
                result.guideSymbols.push(symbol);
            }
        }
    }

    public static parseLine(line: string): GrammarRow | null
    {
        const result: GrammarRow = {
            leftNonTerminal: '',
            rightParts: [],
            guideSymbols: [],
        };

        let action: string | undefined = undefined;
        const actionStart = line.indexOf("{{");
        const actionEnd = line.indexOf("}}");

        let lineWithoutAction = line;
        if (actionStart !== -1 && actionEnd !== -1 && actionEnd > actionStart)
        {
            action = line.substring(actionStart + 2, actionEnd).trim();
            lineWithoutAction = line.substring(0, actionStart).trim();
        }

        const pattern = new RegExp(FULL_RULE_REGEX_STR);
        const matches = lineWithoutAction.match(pattern);

        if (matches)
        {
            result.leftNonTerminal = this.removeExtraBlanks(matches[1]);

            const rightPart = this.removeExtraBlanks(matches[2]);
            this.parseRightParts(result, rightPart);

            const guides = this.removeExtraBlanks(matches[3]);
            this.parseGuideSymbols(result, guides);

            if (action)
            {
                result.action = action;
            }

            return result;
        }

        return null;
    }
}
