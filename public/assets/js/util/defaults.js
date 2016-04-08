/**
 * Default settings for plugins used on many pages
 */
 $.extend(true, $.fn.dataTable.defaults, {
     "dom": "<'row'<'col-xs-6'T><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
     "displayLength": 50,
     "destroy": true,
     "autoWidth": false,
     "deferRender": true,
     "responsive": true,
     "order": []
 });
