import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import GridExample from "@/components/Audit/AuditResult";
import TodoList from "@/app/Todo/page";


const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>

            <ComponentPreview path="/GridExample">
                <GridExample/>
            </ComponentPreview>
            <ComponentPreview path="/TodoList">
                <TodoList/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
