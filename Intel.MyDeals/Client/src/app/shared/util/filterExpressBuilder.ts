
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
    private static dateToString(date: Date): string {
        return ("00" + (date.getMonth() + 1)).slice(-2)
            + "/" + ("00" + date.getDate()).slice(-2)
            + "/" + date.getFullYear() + " "
            + ("00" + date.getHours()).slice(-2) + ":"
            + ("00" + date.getMinutes()).slice(-2)
            + ":" + ("00" + date.getSeconds()).slice(-2);
    }

    private static buildSqlExpression(filter: CompositeFilterDescriptor): string {
        const conditions: string[] = [];

        for (const item of filter.filters) {
            if (item instanceof Object) {
                const subFilter = Object.assign(new FilterDescriptor("", "", null), item);
                if (subFilter && subFilter.field) {

                    if (subFilter.field.includes('_DTM')) {
                        //Setting start time and end time so that date filters will take entire day when selecting a date
                        const dateValue = new Date(subFilter.value);
                        const startOfDay = new Date(dateValue);
                        startOfDay.setHours(0, 0, 0, 0);
                        const endOfDay = new Date(dateValue);
                        endOfDay.setHours(23, 59, 59, 999);
                        let dateFilters: FilterDescriptor[] = [];

                        switch (subFilter.operator) {
                            // Equal to: check entire 
                            case 'eq':
                                dateFilters = [
                                    new FilterDescriptor(subFilter.field, 'gte', this.dateToString(startOfDay)),
                                    new FilterDescriptor(subFilter.field, 'lte', this.dateToString(endOfDay))
                                ];
                                break;
                            case 'lte':
                                subFilter.value = this.dateToString(endOfDay);
                                // Less than or equal: end of selected
                                break;
                            case 'lt':
                                //Less than : Exclude this day
                                subFilter.value = this.dateToString(startOfDay);
                                break;
                            case 'gte':
                                // Greater than or equal: Include this day
                                subFilter.value = this.dateToString(startOfDay);
                                break;
                            case 'gt':
                                // Greater than: Exclude this day
                                subFilter.value = this.dateToString(endOfDay);
                                break;
                        }
                        if (dateFilters.length > 1) {
                            const nested = dateFilters.map(df => this.getSqlCondition(df)).join(" AND ");
                            conditions.push(`(${nested})`);
                            continue; 
                        }
                    }
                    const sqlCondition = this.getSqlCondition(subFilter);
                    conditions.push(sqlCondition);
                } else {
                    const subComposite = Object.assign(new CompositeFilterDescriptor("", []), item);
                    if (subComposite) {
                        if (subComposite.logic == 'or' && Array.isArray(subComposite.filters) && subComposite.filters.length > 0) {
                            const values = subComposite.filters.map(val => {
                                let originalVal = val.value !== null && val.value !== undefined ? val.value : '';
                                const hasSingleQuote = originalVal.includes("'");
                                if (!hasSingleQuote) {
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