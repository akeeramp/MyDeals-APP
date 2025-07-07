export class FilterDescriptor {
    field: string;
    operator: string;
    value: any;

    constructor(field: string, operator: string, value: any) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
}

export class CompositeFilterDescriptor {
    logic: string;
    filters: any[];

    constructor(logic: string, filters: any[]) {
        this.logic = logic;
        this.filters = filters;
    }
}

export class FilterExpressBuilder {
    static createSqlExpression(filterJson: string): string {
        const filterDescriptor: CompositeFilterDescriptor = JSON.parse(filterJson);
        return this.buildSqlExpression(filterDescriptor);
    }

    private static buildSqlExpression(filter: CompositeFilterDescriptor): string {
        const conditions: string[] = [];

        for (const item of filter.filters) {
            if (item instanceof Object) {
                const subFilter = Object.assign(new FilterDescriptor("", "", null), item);
                if (subFilter && subFilter.field) {
                    const sqlCondition = this.getSqlCondition(subFilter);
                    conditions.push(sqlCondition);
                } else {
                    const subComposite = Object.assign(new CompositeFilterDescriptor("", []), item);
                    if (subComposite) {
                        if (subComposite.logic == 'or' && Array.isArray(subComposite.filters) && subComposite.filters.length > 0) {
                            const values = subComposite.filters.map(val => {
                                   let originalVal = val.value !== null && val.value !== undefined ? val.value : '';
                                    const hasSingleQuote = originalVal.includes("'");
                                    if(!hasSingleQuote) {
                                        return `'${originalVal}'`
                                    } else {
                                        let originalValQuotes = originalVal.replace(/'/g, "''");
                                        return `'${originalValQuotes}'`
                                    }
                                
                            }).join(",");
                            const field = subComposite.filters[0].field;
                            conditions.push(`${field} IN (${values == '' ? `''` : `${values}`})`);
                            if (values.split(',').indexOf(`''`) > -1) {
                                conditions[conditions.length - 1] = `(${conditions[conditions.length - 1]} OR ${field} IS NULL)`
                            }
                        }
                        else {
                            const nestedCondition = this.buildSqlExpression(subComposite);
                            conditions.push(`(${nestedCondition})`);
                        }
                    }
                }
            }
        }

        return conditions.join(` ${filter.logic.toUpperCase()} `);
    }

    private static getSqlCondition(subFilter: FilterDescriptor): string {
        switch (subFilter.operator.toLowerCase()) {
            case "contains":
                return `${subFilter.field} LIKE '%${subFilter.value}%'`;
            case "doesnotcontain":
                return `${subFilter.field} NOT LIKE '%${subFilter.value}%'`;
            case "startswith":
                return `${subFilter.field} LIKE '${subFilter.value}%'`;
            case "endswith":
                return `${subFilter.field} LIKE '%${subFilter.value}'`;
            case "isnull":
                return `${subFilter.field} IS NULL`;
            case "isnotnull":
                return `${subFilter.field} IS NOT NULL`;
            case "isempty":
                return `${subFilter.field} = ''`;
            case "isnotempty":
                return `${subFilter.field} != ''`;
            case "eq":
                return `${subFilter.field} = '${subFilter.value}'`;
            case "neq":
                return `${subFilter.field} != '${subFilter.value}'`;
            case "gte":
                return `${subFilter.field} >= '${subFilter.value}'`;
            case "lte":
                return `${subFilter.field} <= '${subFilter.value}'`;
            case "lt":
                return `${subFilter.field} < '${subFilter.value}'`;
            case "gt":
                return `${subFilter.field} > '${subFilter.value}'`;
            default:
                throw new Error(`Unsupported operator: ${subFilter.operator}`);
        }
    }
}