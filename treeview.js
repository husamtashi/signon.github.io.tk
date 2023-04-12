/*!
 * jquery tree menu
 *
 * 
 */
(function($) {

    $.fn.dTree = function(options) {
        var defaults = {
            closeSameLevel: true,
            useCookie: true,
        };

        var settings = $.extend({}, defaults, options);
        //.css({"color":"red","border":"2px solid red"});

        return this.each(function() {

            var $ul = $(this).find('ul');
            var $li = $(this).find('li');
            var $folder = $li.has("ul");

            $folder.prepend("<span class=\"plus\"></span><span class=\"folder\"></span>");
            $li.not($folder).prepend("<span class=\"join\"></span><span class=\"page-tree\"></span>");
            $ul.parent("li").addClass("folder-group");

            $ul.children('li:last-child').not($folder).addClass("join-last");
            $.fn.dTree.tree_first_element($li.first());

            $ul.children('li.folder-group:last-child').addClass("last");


            if (settings.useCookie && $.fn.dTree.check_cookie("dTree")) {
                var object_index = JSON.parse($.fn.dTree.get_cookie("dTree"));
                $.each(object_index, function(key, value) {
                    $this = $ul.find("li.folder-group").eq(value);
                    $.fn.dTree.set_icons($this.children('span:first'));
                    $this.children('ul:first').toggle();
                });
            } else if ($li.hasClass("active")) {
                $active = $ul.find("li.folder-group.active");
                $active.each(function() {
                    $.fn.dTree.set_icons($(this).children('span:first'));
                    $(this).children('ul:first').toggle();
                });

                $active.parentsUntil("div", ".folder-group").each(function() {
                    $.fn.dTree.set_icons($(this).children('span:first'));
                    $(this).children('ul:first').toggle();
                });
            }

            $(this).on('click', '.plus, .minus', function() {

                if (settings.useCookie) {
                    var obect_index = [];
                    $(this).parentsUntil("div", ".folder-group").each(function() {
                        obect_index.push($(this).index(".folder-group"));
                    });
                    $.fn.dTree.set_cookie("dTree", JSON.stringify(obect_index));
                }

                if (settings.closeSameLevel) {
                    $.fn.dTree.close_same_level($(this));
                }
                $.fn.dTree.set_icons($(this));
                $(this).parent().children('ul:first').toggle(250);
            });
        });
    };


    $.fn.dTree.set_cookie = function(name, value) {
        document.cookie = name + "=" + value;
    };

    $.fn.dTree.get_cookie = function(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

    $.fn.dTree.check_cookie = function(name) {
        var _cookie = document.cookie;
        var pattern = new RegExp("" + name + "=([^;=]+)[;\\b]?");

        if (pattern.test(_cookie)) {
            return true;
        }
    }

    $.fn.dTree.set_icons = function($selected) {
        if (!$selected.parent().children('ul:first').is(':visible')) {
            $selected.removeClass("plus").addClass("minus");
            $selected.siblings("span").removeClass("folder").addClass("folder-open");
        } else {
            $selected.removeClass("minus").addClass("plus");
            $selected.siblings("span").removeClass("folder-open").addClass("folder");
        }
    };

    $.fn.dTree.close_same_level = function($selected) {
        var $same_level = $selected.parent().siblings(".folder-group").children('ul:first');

        if ($same_level.is(':visible')) {
            $same_level.toggle(250);
            $.fn.dTree.set_icons($selected.parent().siblings(".folder-group").children('span:first'));
        }
    };

    $.fn.dTree.tree_first_element = function($selected) {
        $selected.children("span.join").remove();
        $selected.children("span").addClass("main").removeClass("page-tree");
    };

}(jQuery));


$(document).ready(function() {
    $(".dTree").dTree();
});

$.fn.extend({
    treed: function (o) {
      
      var openedClass = 'si si-minus';
      var closedClass = 'si si-plus';
      
      if (typeof o != 'undefined'){
        if (typeof o.openedClass != 'undefined'){
        openedClass = o.openedClass;
        }
        if (typeof o.closedClass != 'undefined'){
        closedClass = o.closedClass;
        }
      };
      
        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='si " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamically added icon
      tree.find('.branch .indicator').each(function(){
        $(this).on('click', function () {
            $(this).closest('li').click();
        });
      });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});

//Initialization of treeviews

$('#treeview1').treed();

$('#treeview2').treed();

$('#treeview3').treed();

$('#tree1').treed();

$('#tree2').treed({openedClass:'si si-folder-alt', closedClass:'si si-folder'});

$('#tree3').treed({openedClass:'si si-arrow-right-circle', closedClass:'si si-arrow-down-circle'});
