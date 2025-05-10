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

        const pattern = new RegExp(FULL_RULE_REGEX_STR);
        const matches = line.match(pattern);

        if (matches)
        {
            result.leftNonTerminal = this.removeExtraBlanks(matches[1]);

            let rightPart = matches[2];
            rightPart = this.removeExtraBlanks(rightPart);
            this.parseRightParts(result, rightPart);

            let guides = matches[3];
            guides = this.removeExtraBlanks(guides);
            this.parseGuideSymbols(result, guides);

            return result;
        }
        return null;
    }
}