class className {
    public static normal = 'normal';
    public static moderate = 'moderate'
    public static severe = 'severe'
} 
    
export default class PerfBudget {

    public static GetTTFBClassName = (value: number): string => {
        if (value < 500) return className.normal;
        if (value < 1000) return className.moderate;
        return className.severe;
    }
    public static GetStartRenderClassName = (value: number): string => {
        if (value < 1000) return className.normal;
        if (value < 2000) return className.moderate;
        return className.severe;
    }

    public static GetSpeedIndexClassName = (value: number): string => {
        if (value < 1500) return className.normal;
        if (value < 3000) return className.moderate;
        return className.severe;
    }

    public static GetLoadTimeClassName = (value: number): string => {
        if (value < 4000) return className.normal;
        if (value < 7000) return className.moderate;
        return className.severe;
    }

    public static GetTotalSizeClassName = (value: number): string => {
        if (value < 1000000) return className.normal;
        if (value < 3000000) return className.moderate;
        return className.severe;
    }



       
}
