import {GrammarProcessor} from "./TableGenerator/Processor/GrammarProcessor";

const processor = new GrammarProcessor("../grammar.txt");
processor.processGrammar();
processor.exportTable("../output.json");
processor.exportTable("output.json");