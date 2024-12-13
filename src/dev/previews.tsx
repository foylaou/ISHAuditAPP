import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import GridExample from "@/components/Audit/AuditResult";


const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>

            <ComponentPreview path="/GridExample">
                <GridExample/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
