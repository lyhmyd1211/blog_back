import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import SimpleMdeReact from 'react-simplemde-editor';
import SimpleMDE from 'easymde';
import { message } from 'antd';
import 'easymde/dist/easymde.min.css';
import './style.less';
import day from 'dayjs';
import marked from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import { upload } from './service';
import katex from 'katex';
import 'katex/dist/katex.min.css';
interface props {
  id: string;
  defaultValue: string;
  getValue: (val: string) => any;
  autoSave?: boolean;
  delay?: number;
}
export const MdEditor = (prop: props) => {
  const autosavedValue = localStorage.getItem(`smde_${prop.id}`) || '';
  const [value, setValue] = useState(autosavedValue);
  const onChange = useCallback((val: string) => {
    setValue(val);
    prop.getValue(val);
  }, []);

  const customMarkdownParser: (plainText: string) => string = function (plainText: string) {
    try {
      const text = plainText
        .replace(/\$\$(.*?)\$\$/g, function (match, p1) {
          return (
            "<p class='text-center'>" + katex.renderToString(p1, { displayMode: true }) + '</p>'
          );
        })
        .replace(/\$(.*?[^\\])\$/g, function (match, p1) {
          return katex.renderToString(p1, { displayMode: false });
        })
        .replace(/```math\n([\s\S]*)(.*?)([\s\S]*)\n```/g, function (match, p1) {
          return katex.renderToString(p1, { displayMode: true });
        });
      console.log('text', text);
      return text || '';
    } catch (error) {
      return error + '' || '';
    }
  };

  const styleOptions = useMemo(() => {
    return {
      maxHeight: '65vh',
      autofocus: true,
      spellChecker: false,
      uploadImage: true,
      lineNumbers: true,
      sideBySideFullscreen: false,
      renderingConfig: {
        codeSyntaxHighlighting: true,
        hljs: highlight,
      },
      // autosave: {
      //   enabled: true,
      //   uniqueId: `${prop.id}`,
      //   delay: 1000,
      //   submit_delay: 5000,
      //   timeFormat: {
      //     locale: 'zh-CN',
      //     format: {
      //       year: 'numeric',
      //       month: 'long',
      //       day: '2-digit',
      //       hour: '2-digit',
      //       minute: '2-digit',
      //     },
      //   },
      //   text: '自动保存于: ',
      // },
      toolbar: [
        {
          name: 'Blod',
          action: SimpleMDE.toggleBold,
          className: 'fa fa-bold',
          title: '加粗',
        },
        {
          name: 'italic',
          action: SimpleMDE.toggleItalic,
          className: 'fa fa-italic',
          title: '斜体',
        },
        {
          name: 'strikethrough',
          action: SimpleMDE.toggleStrikethrough,
          className: 'fa fa-strikethrough',
          title: '删除线',
        },
        '|',
        {
          name: 'heading',
          action: SimpleMDE.toggleHeadingBigger,
          className: 'fa fa-header',
          title: '标题',
        },
        {
          name: 'heading-1',
          action: SimpleMDE.toggleHeading1,
          className: 'fa fa-header header-1',
          title: '标题1号',
        },
        {
          name: 'heading-2',
          action: SimpleMDE.toggleHeading2,
          className: 'fa fa-header header-2',
          title: '标题2号',
        },
        {
          name: 'heading-3',
          action: SimpleMDE.toggleHeading3,
          className: 'fa fa-header header-3',
          title: '标题3号',
        },
        '|',
        {
          name: 'horizontal-rule',
          action: SimpleMDE.drawHorizontalRule,
          className: 'fa fa-minus',
          title: '水平线',
        },
        {
          name: 'quote',
          action: SimpleMDE.toggleBlockquote,
          className: 'fa fa-quote-left',
          title: '引用',
        },
        {
          name: 'unordered-list',
          action: SimpleMDE.toggleUnorderedList,
          className: 'fa fa-list-ul',
          title: '无序列表',
        },
        {
          name: 'ordered-list',
          action: SimpleMDE.toggleOrderedList,
          className: 'fa fa-list-ol',
          title: '有序列表',
        },
        {
          name: 'custom',
          action: function customFunction(editor) {
            const cm = editor.codemirror;
            const cursor = cm.getCursor();
            let position = { ch: 0, line: 0 };
            if (cursor.ch != 0) {
              position = { ...cursor, ...{ ch: 0 } };
            } else {
              position = cursor;
            }
            cm.replaceRange('- [ ] ', position, position);
            cm.focus();
          },
          className: 'fa fa-square-o',
          title: '未完成任务列表',
        },
        {
          name: 'custom',
          action: function customFunction(editor) {
            const cm = editor.codemirror;
            const cursor = cm.getCursor();
            let position = { ch: 0, line: 0 };
            if (cursor.ch != 0) {
              position = { ...cursor, ...{ ch: 0 } };
            } else {
              position = cursor;
            }
            cm.replaceRange('- [x] ', position, position);
            cm.focus();
          },
          className: 'fa fa-check-square-o',
          title: '已完成任务列表',
        },
        // {
        //   name: 'custom',
        //   action: function customFunction(editor) {
        //     // Add your own code

        //     const cm = editor.codemirror;
        //     const cursor = cm.getCursor();
        //     let position = { line: cursor.line + 1, ch: 0 };
        //     cm.replaceRange(`<html>`, position, position);
        //     position = { line: position.line + 1, ch: 0 };
        //     cm.replaceRange(`<!--在这里插入内容-->`, position, position);
        //     position = { line: position.line + 1, ch: 0 };
        //     cm.replaceRange(`</html>`, position, position);
        //     cm.focus();
        //     cm.setCursor(position);
        //   },
        //   className: 'fa fa-check-square-o',
        //   title: '插入Html',
        // },
        '|',
        {
          name: 'link',
          action: SimpleMDE.drawLink,
          className: 'fa fa-link',
          title: '链接',
        },
        {
          name: 'image',
          action: SimpleMDE.drawImage,
          className: 'fa fa-picture-o',
          title: '图片',
        },
        {
          name: 'code',
          action: SimpleMDE.toggleCodeBlock,
          className: 'fa fa-code',
          title: '代码',
        },
        {
          name: 'table',
          action: SimpleMDE.drawTable,
          className: 'fa fa-table',
          title: '表格',
        },
        '|',

        // {
        //   name: 'post-article',
        //   action: (editor) => {
        //     this.props.setArticleContent({
        //       mdContent: editor.value(),
        //       htmlContent: editor.markdown(editor.value()),
        //       submit: true,
        //     });
        //   },
        //   className: 'fa-custom-post',
        //   title: '发布文章',
        // },
        {
          name: 'fullscreen',
          action: SimpleMDE.toggleFullScreen,
          className: 'fa fa-arrows-alt no-disable no-mobile fa-custom-right',
          title: '全屏',
        },
        {
          name: 'side-by-side',
          action: SimpleMDE.toggleSideBySide,
          className: 'fa fa-columns no-disable no-mobile fa-custom-right',
          title: '分屏',
        },
        {
          name: 'preview',
          action: SimpleMDE.togglePreview,
          className: 'fa fa-eye no-disable fa-custom-right',
          title: '预览',
        },
      ],
      imageUploadFunction: async (file, onSuccess, onError) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await upload(formData);
        if (res.data) {
          onSuccess(res.data.filePath);
        } else if (res.error) {
          onError(res.error);
        }
      },
      // imageUploadEndpoint: '/api/upload',
      // imagePathAbsolute: true,
      previewRender(plainText) {
        return marked(customMarkdownParser(plainText), {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight: (code) => {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    } as SimpleMDE.Options;
  }, []);
  const interval = useRef<NodeJS.Timeout>();
  const autoSave = () => {
    if (prop.autoSave) {
      interval.current = setInterval(() => {
        localStorage.setItem(`smde_${prop.id}`, value);
        message.success(day(new Date()).format('YYYY-MM-DD HH:mm:ss') + '自动保存成功！');
      }, prop.delay);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
      }
    }
  };
  useEffect(() => {
    setValue(prop.defaultValue);
  }, [prop.defaultValue]);
  useEffect(() => {
    prop.getValue(value);
    autoSave();
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  // const anOptions = useMemo(() => {
  //   return {
  //     autosave: {
  //       enabled: prop.autoSave,
  //       uniqueId: prop.id,
  //       delay: prop.delay,
  //     },
  //   } as SimpleMDE.Options;
  // }, [prop.autoSave, prop.delay, prop.id]);

  return (
    <div className="container">
      <SimpleMdeReact value={value} onChange={onChange} options={styleOptions} />
    </div>
  );
};
